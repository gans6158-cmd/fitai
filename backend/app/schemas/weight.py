from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class WeightLogCreate(BaseModel):
    weight: float = Field(..., gt=0)
    date: Optional[date] = None
    notes: Optional[str] = None


class WeightLogResponse(BaseModel):
    id: str
    user_id: str
    weight: float
    date: date
    notes: Optional[str] = None
    created_at: datetime
