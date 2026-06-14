from fastapi import APIRouter, Depends
from datetime import datetime, timezone, timedelta
from ..database import get_db
from ..schemas.user import UserResponse, UserUpdate
from ..utils.auth import get_current_user
from ..utils.fitness import (
    calculate_bmi, calculate_bmr, calculate_tdee,
    calculate_protein_target, calculate_fitness_score,
)

router = APIRouter(prefix="/api/users", tags=["users"])


def serialize_user(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        age=user["age"],
        gender=user["gender"],
        height=user["height"],
        current_weight=user["current_weight"],
        goal_weight=user["goal_weight"],
        fitness_goal=user["fitness_goal"],
        activity_level=user["activity_level"],
        created_at=user["created_at"],
    )


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user=Depends(get_current_user)):
    return serialize_user(current_user)


@router.put("/me", response_model=UserResponse)
async def update_profile(data: UserUpdate, current_user=Depends(get_current_user)):
    db = get_db()
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"_id": current_user["_id"]}, {"$set": updates})
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return serialize_user(updated)


@router.get("/me/stats")
async def get_stats(current_user=Depends(get_current_user)):
    db = get_db()
    uid = current_user["_id"]

    weight = current_user["current_weight"]
    goal = current_user["goal_weight"]
    height = current_user["height"]
    age = current_user["age"]
    gender = current_user["gender"]

    bmi = calculate_bmi(weight, height)
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, current_user["activity_level"])
    protein = calculate_protein_target(weight, current_user["fitness_goal"])

    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    weight_logs = await db.weight_logs.find({"user_id": uid}).to_list(None)
    workout_logs = await db.workouts.find({"user_id": uid, "created_at": {"$gte": week_ago}}).to_list(None)
    nutrition_logs = await db.nutrition_logs.find({"user_id": uid, "created_at": {"$gte": week_ago}}).to_list(None)

    fitness_score = calculate_fitness_score(weight_logs, workout_logs, nutrition_logs)

    if len(weight_logs) >= 2:
        sorted_logs = sorted(weight_logs, key=lambda x: x["created_at"])
        days_diff = (sorted_logs[-1]["created_at"] - sorted_logs[0]["created_at"]).days or 1
        weight_change = sorted_logs[-1]["weight"] - sorted_logs[0]["weight"]
        weekly_rate = (weight_change / days_diff) * 7
    else:
        weekly_rate = 0

    remaining = goal - weight
    weeks_to_goal = abs(remaining / weekly_rate) if weekly_rate != 0 else None

    return {
        "bmi": bmi,
        "daily_calories": tdee,
        "daily_protein": protein,
        "fitness_score": fitness_score,
        "weight_difference": round(goal - weight, 1),
        "weekly_rate": round(weekly_rate, 2),
        "weeks_to_goal": round(weeks_to_goal, 1) if weeks_to_goal else None,
    }
