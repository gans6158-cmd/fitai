from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    current_weight: float = Field(..., gt=0)
    goal_weight: float = Field(..., gt=0)
    # Optional — onboarding collects these progressively
    age: int = Field(default=25, ge=10, le=120)
    gender: str = "male"
    height: float = Field(default=175.0, gt=0)
    fitness_goal: str = "lose_fat"
    activity_level: str = "moderate"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    current_weight: Optional[float] = None
    goal_weight: Optional[float] = None
    fitness_goal: Optional[str] = None
    activity_level: Optional[str] = None
    gender: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    age: int
    gender: str
    height: float
    current_weight: float
    goal_weight: float
    fitness_goal: str
    activity_level: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
