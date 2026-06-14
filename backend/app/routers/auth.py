from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import secrets
from pydantic import BaseModel
from ..database import get_db
from ..schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from ..utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def serialize_user(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        age=user["age"],
        gender=user["gender"],
        height=user["height"],
        current_weight=user["current_weight"],
        goal_weight=user["goal_weight"],
        fitness_goal=user["fitness_goal"],
        activity_level=user["activity_level"],
        created_at=user["created_at"],
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate):
    db = get_db()
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        **data.model_dump(exclude={"password"}),
        "hashed_password": hash_password(data.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(result.inserted_id)})
    return TokenResponse(access_token=token, user=serialize_user(user_doc))


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"])})
    return TokenResponse(access_token=token, user=serialize_user(user))


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password", status_code=200)
async def change_password(data: ChangePasswordRequest, current_user=Depends(get_current_user)):
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    if not verify_password(data.current_password, current_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    db = get_db()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"hashed_password": hash_password(data.new_password)}},
    )
    return {"message": "Password updated successfully"}


class ForgotPasswordRequest(BaseModel):
    email: str


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    # Always return success to avoid email enumeration
    if not user:
        return {"message": "If that email exists, a reset code has been sent"}

    code = secrets.token_hex(3).upper()  # 6-char hex code e.g. "A3F9B2"
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    await db.password_resets.update_one(
        {"email": data.email},
        {"$set": {"code": hash_password(code), "expires": expires, "email": data.email}},
        upsert=True,
    )
    # In production: send email. For now return code directly.
    return {"message": "Reset code generated", "reset_code": code, "note": "In production this would be emailed"}


class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    db = get_db()
    record = await db.password_resets.find_one({"email": data.email})
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")
    if record["expires"].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset code has expired")
    if not verify_password(data.code, record["code"]):
        raise HTTPException(status_code=400, detail="Invalid reset code")

    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"hashed_password": hash_password(data.new_password)}},
    )
    await db.password_resets.delete_one({"email": data.email})
    return {"message": "Password reset successfully"}
