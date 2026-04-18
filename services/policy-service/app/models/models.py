import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict
from sqlalchemy import Column, DateTime, String, JSON
from sqlmodel import Field, Relationship, SQLModel

class PolicyProfile(SQLModel, table=True):
    __tablename__ = "policy_profiles"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, max_length=100)
    description: Optional[str] = None
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    rules: List["PolicyRule"] = Relationship(back_populates="profile")

class PolicyRule(SQLModel, table=True):
    __tablename__ = "policy_rules"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    profile_id: uuid.UUID = Field(foreign_key="policy_profiles.id")
    action_type: str = Field(max_length=100) # e.g., START_LAB, DLOAD_EVI
    effect: str = Field(max_length=50) # ALLOW, DENY, APPROVAL_REQUIRED
    condition_json: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    priority: int = Field(default=100)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    profile: PolicyProfile = Relationship(back_populates="rules")

class PolicyEvaluation(SQLModel, table=True):
    __tablename__ = "policy_evaluations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(index=True)
    action_requested: str = Field(max_length=100)
    decision: str = Field(max_length=50)
    reason: Optional[str] = None
    enforced_rule_id: Optional[uuid.UUID] = Field(default=None)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    approvals: List["ApprovalRequest"] = Relationship(back_populates="evaluation")

class ApprovalRequest(SQLModel, table=True):
    __tablename__ = "approval_requests"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    evaluation_id: uuid.UUID = Field(foreign_key="policy_evaluations.id")
    status: str = Field(default="PENDING", max_length=50)
    request_details: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    approver_id: Optional[uuid.UUID] = Field(default=None)
    resolved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    evaluation: PolicyEvaluation = Relationship(back_populates="approvals")

class PolicyViolation(SQLModel, table=True):
    __tablename__ = "policy_violations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(index=True)
    rule_id: uuid.UUID = Field(foreign_key="policy_rules.id")
    details: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    severity: str = Field(default="MEDIUM", max_length=50)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
