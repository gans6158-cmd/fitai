from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from datetime import date as DateType


class WeightLogCreate(BaseModel):
    weight: float = Field(..., gt=0)
    date: Optional[DateType] = None
    notes: Optional[str] = None


class WeightLogResponse(BaseModel):
    id: str
    user_id: str
    weight: float
    date: DateType
    notes: Optional[str] = None
    created_at: datetime
