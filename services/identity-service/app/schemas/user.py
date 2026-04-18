from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: UUID
    
    class Config:
        from_attributes = True

class UserOut(UserInDBBase):
    roles: List["RoleOut"] = []

class UserLogin(BaseModel):
    username: str
    password: str

from app.schemas.role import RoleOut
UserOut.update_forward_refs()
