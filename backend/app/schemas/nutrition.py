from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from datetime import date as DateType


class NutritionLogCreate(BaseModel):
    food_name: str
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)
    fats: float = Field(..., ge=0)
    serving_size: Optional[str] = None
    meal_type: Optional[str] = "other"
    date: Optional[DateType] = None


class NutritionLogResponse(BaseModel):
    id: str
    user_id: str
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float
    serving_size: Optional[str] = None
    meal_type: str
    date: DateType
    created_at: datetime
