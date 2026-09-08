from fastapi import APIRouter, HTTPException, Response, Request, Depends
from models.auth import User, UserCreate, UserLogin, GoogleLoginRequest, PasswordResetRequest, UserResponse
from lib.db import db
from passlib.context import CryptContext
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/signup", response_model=UserResponse)
async def signup(data: UserCreate, response: Response):
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    user = User(
        email=data.email.lower(),
        name=data.name,
        role="analyst"
    )
    user_dict = user.model_dump()
    user_dict["password_hash"] = get_password_hash(data.password)
    
    await db.users.insert_one(user_dict)
    
    # Set session cookie
    response.set_cookie(
        key="phish_session",
        value=user.id,
        httponly=True,
        samesite="lax",
        max_age=86400 * 7
    )
    return UserResponse(**user.model_dump())

@router.post("/login", response_model=UserResponse)
async def login(data: UserLogin, response: Response):
    user_doc = await db.users.find_one({"email": data.email.lower()})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    if not verify_password(data.password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    response.set_cookie(
        key="phish_session",
        value=user_doc["id"],
        httponly=True,
        samesite="lax",
        max_age=86400 * 7
    )
    return UserResponse(**user_doc)

@router.post("/google", response_model=UserResponse)
async def google_login(data: GoogleLoginRequest, response: Response):
    user_doc = await db.users.find_one({"email": data.email.lower()})
    if not user_doc:
        user = User(
            email=data.email.lower(),
            name=data.name or data.email.split("@")[0],
            role="analyst"
        )
        user_dict = user.model_dump()
        user_dict["password_hash"] = get_password_hash(str(uuid.uuid4()))
        await db.users.insert_one(user_dict)
        user_doc = user_dict
    
    response.set_cookie(
        key="phish_session",
        value=user_doc["id"],
        httponly=True,
        samesite="lax",
        max_age=86400 * 7
    )
    return UserResponse(**user_doc)

@router.get("/me", response_model=UserResponse)
async def get_current_user(request: Request):
    session_id = request.cookies.get("phish_session")
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_doc = await db.users.find_one({"id": session_id})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    
    # Update scan count
    scans_count = await db.scans.count_documents({"user_id": session_id})
    user_doc["scans_count"] = scans_count
    return UserResponse(**user_doc)

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="phish_session")
    return {"message": "Logged out successfully"}

@router.post("/reset-request")
async def reset_password_request(data: PasswordResetRequest):
    user = await db.users.find_one({"email": data.email.lower()})
    return {"message": "If this email is registered, password reset instructions have been dispatched."}
