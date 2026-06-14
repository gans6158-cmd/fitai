from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from datetime import date as DateType


def epley_1rm(weight: float, reps: int) -> float:
    if reps <= 0 or weight <= 0:
        return 0.0
    if reps == 1:
        return weight
    return weight * (1 + reps / 30)


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
    date: Optional[DateType] = None
    exercises: List[ExerciseCreate]
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None
    calories_burned: Optional[float] = None


class WorkoutResponse(BaseModel):
    id: str
    user_id: str
    name: str
    category: str
    date: DateType
    exercises: List[ExerciseCreate]
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None
    total_volume: float
    calories_burned: Optional[float] = None
    created_at: datetime


class WorkoutCreateResponse(BaseModel):
    workout: WorkoutResponse
    new_prs: List[str]
