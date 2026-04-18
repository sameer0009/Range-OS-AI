import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import Column, JSON, DateTime
from sqlmodel import Field, SQLModel

class TelemetryEvent(SQLModel, table=True):
    __tablename__ = "telemetry_events"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    source: str = Field(index=True, max_length=50) # e.g., 'lab-service'
    level: str = Field(default="INFO", max_length=20) # INFO, WARN, ERROR, CRITICAL
    category: str = Field(index=True, max_length=50) # AUTH, LAB, SYSTEM
    payload: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    trace_id: Optional[uuid.UUID] = Field(default=None, index=True)

class MissionAlert(SQLModel, table=True):
    __tablename__ = "mission_alerts"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    event_id: uuid.UUID = Field(foreign_key="telemetry_events.id")
    message: str = Field(max_length=255)
    status: str = Field(default="OPEN", max_length=50) # OPEN, ACK, RESOLVED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved_at: Optional[datetime] = None
