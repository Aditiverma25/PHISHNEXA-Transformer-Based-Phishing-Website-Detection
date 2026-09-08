from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "analyst"
    api_key: str = Field(default_factory=lambda: f"phish_{uuid.uuid4().hex[:16]}")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    scans_count: int = 0

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    email: EmailStr
    name: str
    google_id: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    api_key: str
    created_at: datetime
    scans_count: int = 0
