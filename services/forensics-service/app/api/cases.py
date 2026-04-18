from fastapi import APIRouter, HTTPException
from typing import List
from app.models.models import ForensicCase
import structlog

logger = structlog.get_logger()
router = APIRouter()

# Mock storage
MOCK_CASES = [
    {
        "id": 1,
        "case_number": "CAS-2026-001",
        "title": "Unauthorized Lateral Movement - Subnet B",
        "status": "active",
        "investigator_id": "ROOT_ADMIN",
        "description": "Investigation into potential DCShadow attack and internal beaconing."
    },
    {
        "id": 2,
        "case_number": "CAS-2026-002",
        "title": "Financial Data Exfiltration Attempt",
        "status": "archived",
        "investigator_id": "INVESTIGATOR_02",
        "description": "Seized workstations from the finance segment following a high-severity DLP alert."
    }
]

@router.get("/cases", response_model=List[ForensicCase])
async def list_cases():
    return MOCK_CASES

@router.post("/cases", response_model=ForensicCase)
async def create_case(case: ForensicCase):
    await logger.info("forensic_case_created", case_number=case.case_number)
    return case

@router.get("/cases/{case_id}", response_model=ForensicCase)
async def get_case(case_id: int):
    case = next((c for c in MOCK_CASES if c["id"] == case_id), None)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case
