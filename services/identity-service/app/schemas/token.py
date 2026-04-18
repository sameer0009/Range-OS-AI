from typing import Optional, List
from pydantic import BaseModel
from app.schemas.user import UserOut

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
