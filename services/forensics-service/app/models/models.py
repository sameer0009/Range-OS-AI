import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict
from sqlalchemy import Column, DateTime, String, JSON, Integer
from sqlmodel import Field, Relationship, SQLModel

class ForensicCase(SQLModel, table=True):
    __tablename__ = "forensic_cases"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    mission_id: uuid.UUID = Field(index=True)
    title: str = Field(max_length=200)
    status: str = Field(default="DISCOVERY", max_length=50) # DISCOVERY, ANALYSIS, FINALIZED
    investigator_id: uuid.UUID = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    evidence_items: List["EvidenceItem"] = Relationship(back_populates="case")
    timeline_events: List["TimelineEvent"] = Relationship(back_populates="case")

class EvidenceItem(SQLModel, table=True):
    __tablename__ = "evidence_items"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    case_id: uuid.UUID = Field(foreign_key="forensic_cases.id")
    type: str = Field(max_length=50) # PCAP, DISK_IMAGE, MEM_DUMP
    storage_path: str = Field(max_length=255)
    checksum_sha256: str = Field(max_length=64)
    captured_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    case: ForensicCase = Relationship(back_populates="evidence_items")
    custody_chain: List["ChainOfCustody"] = Relationship(back_populates="evidence_item")

class ChainOfCustody(SQLModel, table=True):
    __tablename__ = "chain_of_custody"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    evidence_item_id: uuid.UUID = Field(foreign_key="evidence_items.id")
    action: str = Field(max_length=100) # ACQUIRED, VERIFIED, ACCESSED
    operator_id: uuid.UUID = Field(index=True)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata_json: Dict = Field(default_factory=dict, sa_column=Column("metadata", JSON))
    
    evidence_item: EvidenceItem = Relationship(back_populates="custody_chain")

class TimelineEvent(SQLModel, table=True):
    __tablename__ = "forensic_timeline"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    case_id: uuid.UUID = Field(foreign_key="forensic_cases.id")
    timestamp: datetime = Field(index=True)
    source: str = Field(max_length=100)
    category: str = Field(max_length=50) # POLICY, AUTH, LAB_STATE
    description: str = Field(sa_column=Column(String))
    
    case: ForensicCase = Relationship(back_populates="timeline_events")
