import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict
from sqlalchemy import Column, DateTime, String, JSON, Integer
from sqlmodel import Field, Relationship, SQLModel

class Report(SQLModel, table=True):
    __tablename__ = "reports"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    mission_id: Optional[uuid.UUID] = Field(default=None, index=True)
    title: str = Field(max_length=200)
    type: str = Field(max_length=50) # PENTEST, FORENSIC, INCIDENT, TRAINING
    status: str = Field(default="DRAFT", max_length=50) # DRAFT, REVIEW, FINALIZED, ARCHIVED
    author_id: uuid.UUID = Field(index=True)
    current_version: str = Field(default="1.0.0")
    metadata_json: Dict = Field(default_factory=dict, sa_column=Column("metadata", JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)})
    
    versions: List["ReportVersion"] = Relationship(back_populates="report")
    sections: List["ReportSection"] = Relationship(back_populates="report")

class ReportVersion(SQLModel, table=True):
    __tablename__ = "report_versions"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    report_id: uuid.UUID = Field(foreign_key="reports.id")
    version_number: str = Field(max_length=20)
    change_summary: Optional[str] = None
    created_by: uuid.UUID = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    report: Report = Relationship(back_populates="versions")

class ReportSection(SQLModel, table=True):
    __tablename__ = "report_sections"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    report_id: uuid.UUID = Field(foreign_key="reports.id")
    title: str = Field(max_length=100)
    content_body: str = Field(sa_column=Column(String)) # Markdown content
    order_index: int = Field(default=0)
    
    report: Report = Relationship(back_populates="sections")
