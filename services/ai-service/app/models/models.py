import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict
from sqlalchemy import Column, DateTime, String, JSON
from sqlmodel import Field, SQLModel

class AIInteraction(SQLModel, table=True):
    __tablename__ = "ai_interactions"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    mission_id: uuid.UUID = Field(index=True)
    operator_id: uuid.UUID = Field(index=True)
    profile: str = Field(max_length=50) # Tutor, Architect, Analyst, Writer
    
    prompt: str = Field(sa_column=Column(String))
    response: str = Field(sa_column=Column(String))
    
    # Grounding Context Snapshot
    context_snapshot: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AgentProfile(SQLModel):
    id: str
    name: str
    description: str
    system_prompt: str
    capabilities: List[str]

# Standard Profiles
RANGE_OS_PERSONAS = {
    "TUTOR": AgentProfile(
        id="tutor",
        name="Tactical Tutor",
        description="Focused on skills development and tool mastery.",
        system_prompt="You are the Tactical Tutor. Guide the user through offensive and defensive security concepts. Provide step-by-step instructions.",
        capabilities=["TOOL_MASTERY", "PROTOCOL_EXPLANATION"]
    ),
    "ANALYST": AgentProfile(
        id="analyst",
        name="Mission Analyst",
        description="Focused on intelligence analysis and forensic reconstruction.",
        system_prompt="You are the Mission Analyst. Analyze telemetry events and forensic artifacts to identify intrusion patterns.",
        capabilities=["INTRUSION_ANALYSIS", "FORENSIC_PIVOTING"]
    )
}
