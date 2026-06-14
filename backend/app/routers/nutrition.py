from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime, timezone, date
from typing import List, Optional
from ..database import get_db
from ..schemas.nutrition import NutritionLogCreate, NutritionLogResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/nutrition", tags=["nutrition"])


def serialize(n: dict) -> NutritionLogResponse:
    return NutritionLogResponse(
        id=str(n["_id"]),
        user_id=str(n["user_id"]),
        food_name=n["food_name"],
        calories=n["calories"],
        protein=n["protein"],
        carbs=n["carbs"],
        fats=n["fats"],
        serving_size=n.get("serving_size"),
        meal_type=n.get("meal_type", "other"),
        date=n["date"],
        created_at=n["created_at"],
    )


@router.post("", response_model=NutritionLogResponse, status_code=201)
async def log_food(data: NutritionLogCreate, current_user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "user_id": current_user["_id"],
        **data.model_dump(exclude={"date"}),
        "date": data.date or date.today(),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.nutrition_logs.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize(doc)


@router.get("", response_model=List[NutritionLogResponse])
async def get_nutrition_logs(log_date: Optional[date] = None, current_user=Depends(get_current_user)):
    db = get_db()
    query = {"user_id": current_user["_id"]}
    if log_date:
        query["date"] = log_date
    logs = await db.nutrition_logs.find(query).sort("created_at", -1).to_list(None)
    return [serialize(l) for l in logs]


@router.get("/today")
async def get_today_summary(current_user=Depends(get_current_user)):
    db = get_db()
    today = date.today()
    logs = await db.nutrition_logs.find({"user_id": current_user["_id"], "date": today}).to_list(None)

    from ..utils.fitness import calculate_bmr, calculate_tdee, calculate_protein_target
    weight = current_user["current_weight"]
    height = current_user["height"]
    age = current_user["age"]
    gender = current_user["gender"]
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, current_user["activity_level"])
    protein_target = calculate_protein_target(weight, current_user["fitness_goal"])

    consumed_calories = sum(l["calories"] for l in logs)
    consumed_protein = sum(l["protein"] for l in logs)
    consumed_carbs = sum(l["carbs"] for l in logs)
    consumed_fats = sum(l["fats"] for l in logs)

    return {
        "consumed_calories": round(consumed_calories, 1),
        "remaining_calories": round(tdee - consumed_calories, 1),
        "target_calories": tdee,
        "consumed_protein": round(consumed_protein, 1),
        "remaining_protein": round(protein_target - consumed_protein, 1),
        "target_protein": protein_target,
        "consumed_carbs": round(consumed_carbs, 1),
        "consumed_fats": round(consumed_fats, 1),
        "logs": [serialize(l) for l in logs],
    }


@router.delete("/{log_id}", status_code=204)
async def delete_nutrition_log(log_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.nutrition_logs.delete_one({"_id": ObjectId(log_id), "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
