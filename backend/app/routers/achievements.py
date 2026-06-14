from fastapi import APIRouter, Depends
from ..database import get_db
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

BADGES = [
    {"id": "first_workout", "name": "First Workout", "description": "Completed your first workout", "icon": "🏋️"},
    {"id": "streak_7", "name": "7-Day Streak", "description": "Logged nutrition for 7+ days", "icon": "🔥"},
    {"id": "streak_30", "name": "30-Day Streak", "description": "Logged nutrition for 30+ days", "icon": "⚡"},
    {"id": "lost_5kg", "name": "5kg Lost", "description": "Lost 5kg from starting weight", "icon": "🎯"},
    {"id": "lost_10kg", "name": "10kg Lost", "description": "Lost 10kg from starting weight", "icon": "🏆"},
    {"id": "workouts_100", "name": "Century Club", "description": "Completed 100 workouts", "icon": "💯"},
]


@router.get("")
async def get_achievements(current_user=Depends(get_current_user)):
    db = get_db()
    uid = current_user["_id"]

    workouts = await db.workouts.find({"user_id": uid}).to_list(None)
    weight_logs = await db.weight_logs.find({"user_id": uid}).sort("date", 1).to_list(None)
    nutrition_logs = await db.nutrition_logs.find({"user_id": uid}).to_list(None)

    earned: set = set()

    if len(workouts) >= 1:
        earned.add("first_workout")
    if len(workouts) >= 100:
        earned.add("workouts_100")

    if weight_logs:
        first_weight = weight_logs[0]["weight"]
        latest_weight = weight_logs[-1]["weight"]
        lost = first_weight - latest_weight
        if lost >= 5:
            earned.add("lost_5kg")
        if lost >= 10:
            earned.add("lost_10kg")

    if len(nutrition_logs) >= 7:
        earned.add("streak_7")
    if len(nutrition_logs) >= 30:
        earned.add("streak_30")

    return [{**badge, "earned": badge["id"] in earned} for badge in BADGES]
