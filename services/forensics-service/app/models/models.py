from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class ForensicCase(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_number: str = Field(index=True, unique=True)
    title: str
    description: Optional[str] = None
    status: str = Field(default="active") # active, pending, archived
    investigator_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    evidence_items: List["EvidenceItem"] = Relationship(back_populates="case")
    findings: List["ForensicFinding"] = Relationship(back_populates="case")
    timeline_events: List["TimelineEvent"] = Relationship(back_populates="case")

class EvidenceItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="forensiccase.id")
    name: str
    filename: str
    type: str # Memory, Disk, Network, Log
    source_node: str
    captured_at: datetime = Field(default_factory=datetime.utcnow)
    size_bytes: int
    
    case: ForensicCase = Relationship(back_populates="evidence_items")
    hashes: List["EvidenceHash"] = Relationship(back_populates="evidence_item")
    custody_records: List["ChainOfCustody"] = Relationship(back_populates="evidence_item")

class EvidenceHash(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    evidence_item_id: int = Field(foreign_key="evidenceitem.id")
    hash_type: str # SHA-256, MD5
    hash_value: str
    verified_at: datetime = Field(default_factory=datetime.utcnow)
    
    evidence_item: EvidenceItem = Relationship(back_populates="hashes")

class ChainOfCustody(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    evidence_item_id: int = Field(foreign_key="evidenceitem.id")
    action: str # Captured, Moved, Verified, Analyzed
    operator_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None
    
    evidence_item: EvidenceItem = Relationship(back_populates="custody_records")

class TimelineEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="forensiccase.id")
    timestamp: datetime
    description: str
    source_node: str
    severity: str # critical, warn, info
    
    case: ForensicCase = Relationship(back_populates="timeline_events")

class ForensicFinding(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="forensiccase.id")
    evidence_item_id: Optional[int] = Field(default=None, foreign_key="evidenceitem.id")
    title: str
    summary: str
    confidence_level: int = Field(default=50) # 0-100
    
    case: ForensicCase = Relationship(back_populates="findings")
