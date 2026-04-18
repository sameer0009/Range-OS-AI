from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class PlatformBaseModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PlatformAuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    service_name: str
    action: str
    actor_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata_json: Optional[str] = None
