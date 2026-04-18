from fastapi import APIRouter
from typing import List
from app.models.models import EvidenceItem, EvidenceHash
import structlog

logger = structlog.get_logger()
router = APIRouter()

MOCK_EVIDENCE = [
    {
        "id": 1,
        "case_id": 1,
        "name": "SRV-DC_Memory_Dump",
        "filename": "srv-dc-mem.raw",
        "type": "Memory",
        "source_node": "SRV-DC",
        "size_bytes": 16000000000
    },
    {
        "id": 2,
        "case_id": 1,
        "name": "Edge_Router_PCAP",
        "filename": "edge-router-traffic.pcap",
        "type": "Network",
        "source_node": "ROUTER-01",
        "size_bytes": 512000000
    }
]

@router.get("/evidence", response_model=List[EvidenceItem])
async def list_evidence(case_id: Optional[int] = None):
    if case_id:
        return [e for e in MOCK_EVIDENCE if e["case_id"] == case_id]
    return MOCK_EVIDENCE

@router.get("/evidence/{evidence_id}/verify")
async def verify_evidence(evidence_id: int):
    await logger.info("evidence_integrity_check", evidence_id=evidence_id)
    return {
        "id": evidence_id,
        "status": "VERIFIED",
        "hash": "4f8a9c2e...8b1e4a0d",
        "timestamp": "2026-04-18T19:27:00Z"
    }
