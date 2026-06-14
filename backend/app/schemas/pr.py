from pydantic import BaseModel
from datetime import datetime, date


class PRResponse(BaseModel):
    id: str
    exercise_name: str
    weight: float
    reps: int
    estimated_1rm: float
    date: date
    created_at: datetime
