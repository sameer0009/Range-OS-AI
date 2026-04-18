from fastapi import APIRouter
from typing import List, Optional
from app.models.models import Report, ReportSection
import structlog

logger = structlog.get_logger()
router = APIRouter()

MOCK_REPORTS = [
    {
        "id": 1,
        "title": "Post-Incident Analysis: Subnet B Breach",
        "type": "INCIDENT",
        "status": "FINALIZED",
        "author_id": "ROOT_ADMIN",
        "version": "1.2.0",
        "case_id": "CAS-2026-0042",
        "sections": [
            {"title": "Executive Summary", "content_body": "On 2026-04-18, lateral movement was detected in Subnet B...", "order_index": 0},
            {"title": "Attack Vector", "content_body": "Initial access gained via compromised VPN credentials...", "order_index": 1}
        ]
    },
    {
        "id": 2,
        "title": "Quarterly Pentest: Finance Segment",
        "type": "PENTEST",
        "status": "DRAFT",
        "author_id": "SEC_ENG_01",
        "version": "0.8.4",
        "case_id": None,
        "sections": [
            {"title": "Scope", "content_body": "All workstations and servers within the 10.0.8.0/24 subnet.", "order_index": 0}
        ]
    }
]

@router.get("/reports", response_model=List[Report])
async def list_reports(report_type: Optional[str] = None):
    if report_type:
        return [r for r in MOCK_REPORTS if r["type"] == report_type]
    return MOCK_REPORTS

@router.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: int):
    report = next((r for r in MOCK_REPORTS if r["id"] == report_id), None)
    return report

@router.post("/reports/{report_id}/export")
async def export_report(report_id: int):
    await logger.info("report_export_triggered", report_id=report_id)
    return {"id": report_id, "format": "PDF", "status": "PENDING", "download_url": "#"}
