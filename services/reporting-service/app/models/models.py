from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: Optional[str] = Field(default=None, index=True)
    title: str
    type: str # PENTEST, FORENSIC, INCIDENT, SUMMARY
    status: str = Field(default="DRAFT") # DRAFT, FINALIZED
    author_id: str
    version: str = Field(default="1.0.0")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    sections: List["ReportSection"] = Relationship(back_populates="report")

class ReportSection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    report_id: int = Field(foreign_key="report.id")
    title: str
    content_body: str
    order_index: int
    
    report: Report = Relationship(back_populates="sections")

class ReportVersion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    report_id: int = Field(foreign_key="report.id")
    version_number: str
    change_summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str
