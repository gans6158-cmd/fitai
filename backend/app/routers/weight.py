from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime, timezone, date
from typing import List
from ..database import get_db
from ..schemas.weight import WeightLogCreate, WeightLogResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/weight", tags=["weight"])


def serialize(log: dict) -> WeightLogResponse:
    return WeightLogResponse(
        id=str(log["_id"]),
        user_id=str(log["user_id"]),
        weight=log["weight"],
        date=log["date"],
        notes=log.get("notes"),
        created_at=log["created_at"],
    )


@router.post("", response_model=WeightLogResponse, status_code=201)
async def add_weight(data: WeightLogCreate, current_user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "user_id": current_user["_id"],
        "weight": data.weight,
        "date": data.date or date.today(),
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.weight_logs.insert_one(doc)
    doc["_id"] = result.inserted_id
    await db.users.update_one({"_id": current_user["_id"]}, {"$set": {"current_weight": data.weight}})
    return serialize(doc)


@router.get("", response_model=List[WeightLogResponse])
async def get_weight_logs(current_user=Depends(get_current_user)):
    db = get_db()
    logs = await db.weight_logs.find({"user_id": current_user["_id"]}).sort("date", -1).to_list(None)
    return [serialize(l) for l in logs]


@router.delete("/{log_id}", status_code=204)
async def delete_weight_log(log_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.weight_logs.delete_one({"_id": ObjectId(log_id), "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
