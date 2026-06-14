from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime, timezone, date, timedelta
from typing import List
from ..database import get_db
from ..schemas.workout import WorkoutCreate, WorkoutResponse, WorkoutCreateResponse, epley_1rm
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/workouts", tags=["workouts"])


def calc_volume(exercises: list) -> float:
    total = 0.0
    for ex in exercises:
        for s in ex.get("sets", []):
            total += s.get("reps", 0) * s.get("weight", 0)
    return total


def serialize(w: dict) -> WorkoutResponse:
    return WorkoutResponse(
        id=str(w["_id"]),
        user_id=str(w["user_id"]),
        name=w["name"],
        category=w["category"],
        date=w["date"],
        exercises=w["exercises"],
        notes=w.get("notes"),
        duration_minutes=w.get("duration_minutes"),
        total_volume=w.get("total_volume", 0),
        calories_burned=w.get("calories_burned"),
        created_at=w["created_at"],
    )


@router.post("", response_model=WorkoutCreateResponse, status_code=201)
async def create_workout(data: WorkoutCreate, current_user=Depends(get_current_user)):
    db = get_db()
    exercises_dict = [ex.model_dump() for ex in data.exercises]
    raw_date = data.date or date.today()
    date_str = raw_date.isoformat()  # "2026-06-14" — BSON can't encode datetime.date directly
    doc = {
        "user_id": current_user["_id"],
        "name": data.name,
        "category": data.category,
        "date": date_str,
        "exercises": exercises_dict,
        "notes": data.notes,
        "duration_minutes": data.duration_minutes,
        "total_volume": calc_volume(exercises_dict),
        "calories_burned": data.calories_burned,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.workouts.insert_one(doc)
    doc["_id"] = result.inserted_id

    new_prs: list[str] = []
    for ex in exercises_dict:
        ex_name = ex.get("name", "").strip()
        if not ex_name:
            continue
        best_1rm = 0.0
        best_weight = 0.0
        best_reps = 0
        for s in ex.get("sets", []):
            w = float(s.get("weight", 0))
            r = int(s.get("reps", 0))
            if w > 0 and r > 0:
                e1rm = epley_1rm(w, r)
                if e1rm > best_1rm:
                    best_1rm, best_weight, best_reps = e1rm, w, r
        if best_1rm == 0:
            continue
        existing = await db.prs.find_one({"user_id": current_user["_id"], "exercise_name": ex_name})
        if existing is None:
            await db.prs.update_one(
                {"user_id": current_user["_id"], "exercise_name": ex_name},
                {"$set": {
                    "user_id": current_user["_id"],
                    "exercise_name": ex_name,
                    "weight": best_weight,
                    "reps": best_reps,
                    "estimated_1rm": round(best_1rm, 2),
                    "date": date_str,
                    "initial_weight": best_weight,
                    "initial_reps": best_reps,
                    "initial_estimated_1rm": round(best_1rm, 2),
                    "initial_date": date_str,
                    "created_at": datetime.now(timezone.utc),
                }},
                upsert=True,
            )
            new_prs.append(ex_name)
        elif best_1rm > existing.get("estimated_1rm", 0):
            await db.prs.update_one(
                {"user_id": current_user["_id"], "exercise_name": ex_name},
                {"$set": {
                    "weight": best_weight,
                    "reps": best_reps,
                    "estimated_1rm": round(best_1rm, 2),
                    "date": date_str,
                    "created_at": datetime.now(timezone.utc),
                }},
            )
            new_prs.append(ex_name)

    return WorkoutCreateResponse(workout=serialize(doc), new_prs=new_prs)


@router.get("", response_model=List[WorkoutResponse])
async def get_workouts(current_user=Depends(get_current_user)):
    db = get_db()
    workouts = await db.workouts.find({"user_id": current_user["_id"]}).sort("date", -1).to_list(None)
    return [serialize(w) for w in workouts]


@router.get("/analytics")
async def get_workout_analytics(current_user=Depends(get_current_user)):
    db = get_db()
    workouts = await db.workouts.find({"user_id": current_user["_id"]}).to_list(None)

    total_volume = sum(w.get("total_volume", 0) for w in workouts)
    category_counts: dict = {}
    for w in workouts:
        cat = w["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1

    total_calories = sum(w.get("calories_burned") or 0 for w in workouts)

    # Streak: consecutive days with at least one workout, going back from today
    workout_dates = set(w["date"] for w in workouts)
    today = date.today()
    streak = 0
    check = today
    while check.isoformat() in workout_dates:
        streak += 1
        check -= timedelta(days=1)
    if streak == 0:
        check = today - timedelta(days=1)
        while check.isoformat() in workout_dates:
            streak += 1
            check -= timedelta(days=1)

    return {
        "total_workouts": len(workouts),
        "total_volume": round(total_volume, 1),
        "total_calories_burned": round(total_calories),
        "category_breakdown": category_counts,
        "weekly_count": len([w for w in workouts if (datetime.utcnow() - w["created_at"].replace(tzinfo=None)).days <= 7]),
        "streak": streak,
    }


@router.delete("/{workout_id}", status_code=204)
async def delete_workout(workout_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.workouts.delete_one({"_id": ObjectId(workout_id), "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
