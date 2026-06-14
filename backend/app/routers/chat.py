from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from bson import ObjectId
from typing import List
from ..database import get_db
from ..schemas.chat import ChatMessageCreate, ChatMessageResponse, ChatResponse
from ..utils.auth import get_current_user
from ..config import settings

router = APIRouter(prefix="/api/chat", tags=["chat"])


async def build_system_prompt(user: dict, db) -> str:
    uid = user["_id"]
    weight_logs = await db.weight_logs.find({"user_id": uid}).sort("date", -1).limit(10).to_list(None)
    workout_logs = await db.workouts.find({"user_id": uid}).sort("date", -1).limit(5).to_list(None)

    weight_history = ", ".join([f"{l['weight']}kg on {l['date']}" for l in weight_logs[:5]])
    workout_history = ", ".join([f"{w['name']} ({w['category']})" for w in workout_logs[:5]])

    return f"""You are FitAI, a personal AI fitness coach. You have access to the user's data:

Name: {user['name']}
Age: {user['age']}, Gender: {user['gender']}
Height: {user['height']}cm, Current Weight: {user['current_weight']}kg, Goal Weight: {user['goal_weight']}kg
Fitness Goal: {user['fitness_goal']}, Activity Level: {user['activity_level']}
Recent Weight History: {weight_history or 'No data yet'}
Recent Workouts: {workout_history or 'No workouts yet'}

Provide personalized, motivating fitness advice. Be concise and actionable. Format responses with bullet points when listing items."""


@router.post("", response_model=ChatResponse)
async def send_message(data: ChatMessageCreate, current_user=Depends(get_current_user)):
    db = get_db()

    if not settings.OPENAI_API_KEY:
        reply = (
            f"Hi {current_user['name']}! I'm your FitAI coach. "
            "To enable AI responses, configure your OpenAI API key. "
            f"Your goal is {current_user['goal_weight']}kg — keep going!"
        )
    else:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

            history = await db.chat_history.find({"user_id": current_user["_id"]}).sort("created_at", -1).limit(10).to_list(None)
            history.reverse()

            messages = [{"role": "system", "content": await build_system_prompt(current_user, db)}]
            for h in history:
                messages.append({"role": h["role"], "content": h["content"]})
            messages.append({"role": "user", "content": data.message})

            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=500,
            )
            reply = response.choices[0].message.content
        except Exception as e:
            reply = f"Sorry, I'm having trouble connecting right now. Error: {str(e)[:100]}"

    await db.chat_history.insert_one({
        "user_id": current_user["_id"],
        "role": "user",
        "content": data.message,
        "created_at": datetime.now(timezone.utc),
    })

    assistant_msg = await db.chat_history.insert_one({
        "user_id": current_user["_id"],
        "role": "assistant",
        "content": reply,
        "created_at": datetime.now(timezone.utc),
    })

    return ChatResponse(reply=reply, message_id=str(assistant_msg.inserted_id))


@router.get("/history", response_model=List[ChatMessageResponse])
async def get_chat_history(current_user=Depends(get_current_user)):
    db = get_db()
    history = await db.chat_history.find({"user_id": current_user["_id"]}).sort("created_at", 1).to_list(50)
    return [
        ChatMessageResponse(
            id=str(h["_id"]),
            user_id=str(h["user_id"]),
            role=h["role"],
            content=h["content"],
            created_at=h["created_at"],
        )
        for h in history
    ]
