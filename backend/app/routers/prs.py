from fastapi import APIRouter, Depends
from typing import List
from ..database import get_db
from ..schemas.pr import PRResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/prs", tags=["prs"])


def serialize_pr(p: dict) -> PRResponse:
    return PRResponse(
        id=str(p["_id"]),
        exercise_name=p["exercise_name"],
        weight=p["weight"],
        reps=p["reps"],
        estimated_1rm=p["estimated_1rm"],
        date=p["date"],
        created_at=p["created_at"],
    )


@router.get("", response_model=List[PRResponse])
async def get_prs(current_user=Depends(get_current_user)):
    db = get_db()
    prs = await db.prs.find({"user_id": current_user["_id"]}).sort("estimated_1rm", -1).to_list(None)
    return [serialize_pr(p) for p in prs]
