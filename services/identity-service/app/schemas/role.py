from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    pass

class RoleOut(RoleBase):
    id: UUID
    
    class Config:
        from_attributes = True
