from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatMessageCreate(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    id: str
    user_id: str
    role: str
    content: str
    created_at: datetime


class ChatResponse(BaseModel):
    reply: str
    message_id: str
