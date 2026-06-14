from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class ExerciseSet(BaseModel):
    reps: int = Field(..., ge=1)
    weight: float = Field(..., ge=0)


class ExerciseCreate(BaseModel):
    name: str
    sets: List[ExerciseSet]
    notes: Optional[str] = None


class WorkoutCreate(BaseModel):
    name: str
    category: str
    date: Optional[date] = None
    exercises: List[ExerciseCreate]
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None


class WorkoutResponse(BaseModel):
    id: str
    user_id: str
    name: str
    category: str
    date: date
    exercises: List[ExerciseCreate]
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None
    total_volume: float
    created_at: datetime
