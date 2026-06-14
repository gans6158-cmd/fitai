from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from datetime import date as DateType


class PRResponse(BaseModel):
    id: str
    exercise_name: str
    weight: float
    reps: int
    estimated_1rm: float
    date: DateType
    initial_weight: Optional[float] = None
    initial_reps: Optional[int] = None
    initial_estimated_1rm: Optional[float] = None
    initial_date: Optional[DateType] = None
    created_at: datetime
