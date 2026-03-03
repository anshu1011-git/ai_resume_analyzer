from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional, Any

class ResumeBase(BaseModel):
    original_filename: str

class ResumeCreate(ResumeBase):
    extracted_text: str
    overall_score: float
    ats_score: float
    ai_response_json: dict

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    overall_score: float
    ats_score: float
    ai_response_json: dict
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class JobMatchRequest(BaseModel):
    job_description: str

