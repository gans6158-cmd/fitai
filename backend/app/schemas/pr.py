from pydantic import BaseModel
from datetime import datetime
from datetime import date as DateType


class PRResponse(BaseModel):
    id: str
    exercise_name: str
    weight: float
    reps: int
    estimated_1rm: float
    date: DateType
    created_at: datetime
