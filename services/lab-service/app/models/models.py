import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict
from sqlalchemy import Column, DateTime, String, JSON
from sqlmodel import Field, Relationship, SQLModel

class LabTemplate(SQLModel, table=True):
    __tablename__ = "lab_templates"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, max_length=100)
    description: Optional[str] = None
    complexity: str = Field(default="Beginner", max_length=50)
    topology_spec: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    is_public: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    labs: List["GeneratedLab"] = Relationship(back_populates="template")

class GeneratedLab(SQLModel, table=True):
    __tablename__ = "generated_labs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    template_id: uuid.UUID = Field(foreign_key="lab_templates.id")
    owner_id: uuid.UUID = Field(index=True)
    
    # State Machine Integration
    status: str = Field(default="REQUESTED", max_length=50)
    lifecycle_context: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)})

    template: LabTemplate = Relationship(back_populates="labs")
    nodes: List["LabNode"] = Relationship(back_populates="lab")
    networks: List["LabNetwork"] = Relationship(back_populates="lab")
    snapshots: List["LabSnapshot"] = Relationship(back_populates="lab")
    tasks: List["LabTask"] = Relationship(back_populates="lab")

class LabNode(SQLModel, table=True):
    __tablename__ = "lab_nodes"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lab_id: uuid.UUID = Field(foreign_key="generated_labs.id")
    name: str = Field(max_length=100)
    type: str = Field(max_length=50) # windows, linux, router
    status: str = Field(default="Offline", max_length=50)
    metadata_json: Dict = Field(default_factory=dict, sa_column=Column("metadata", JSON))
    
    lab: GeneratedLab = Relationship(back_populates="nodes")

class LabNetwork(SQLModel, table=True):
    __tablename__ = "lab_networks"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lab_id: uuid.UUID = Field(foreign_key="generated_labs.id")
    name: str = Field(max_length=100)
    subnet: str = Field(max_length=50)
    is_isolated: bool = Field(default=True)
    
    lab: GeneratedLab = Relationship(back_populates="networks")

class LabSnapshot(SQLModel, table=True):
    __tablename__ = "lab_snapshots"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lab_id: uuid.UUID = Field(foreign_key="generated_labs.id")
    name: str = Field(max_length=100)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    lab: GeneratedLab = Relationship(back_populates="snapshots")

class LabTask(SQLModel, table=True):
    __tablename__ = "lab_tasks"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lab_id: uuid.UUID = Field(foreign_key="generated_labs.id")
    type: str = Field(max_length=50) # RESET, SNAPSHOT, DEPLOY
    status: str = Field(default="Pending", max_length=50)
    progress: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    lab: GeneratedLab = Relationship(back_populates="tasks")
