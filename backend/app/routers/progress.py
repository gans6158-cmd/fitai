from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])


class ProgressPhotoCreate(BaseModel):
    photo_data: str
    label: Optional[str] = "Progress"
    date: Optional[str] = None
    notes: Optional[str] = None


def serialize(p: dict) -> dict:
    return {
        "id": str(p["_id"]),
        "photo_data": p["photo_data"],
        "label": p.get("label", "Progress"),
        "date": p.get("date"),
        "notes": p.get("notes"),
        "created_at": p["created_at"],
    }


@router.post("/photos", status_code=201)
async def upload_photo(data: ProgressPhotoCreate, current_user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "user_id": str(current_user["_id"]),
        "photo_data": data.photo_data,
        "label": data.label or "Progress",
        "date": data.date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.progress_photos.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize(doc)


@router.get("/photos")
async def get_photos(current_user=Depends(get_current_user)):
    db = get_db()
    photos = await db.progress_photos.find(
        {"user_id": str(current_user["_id"])}
    ).sort("date", -1).to_list(200)
    return [serialize(p) for p in photos]


@router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.progress_photos.delete_one({
        "_id": ObjectId(photo_id),
        "user_id": str(current_user["_id"]),
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"status": "deleted"}
