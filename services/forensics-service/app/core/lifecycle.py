import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select
from ..models.models import ForensicCase, ChainOfCustody
import structlog

logger = structlog.get_logger()

VALID_CASE_TRANSITIONS = {
    "DISCOVERY": ["ANALYSIS", "ARCHIVED"],
    "ANALYSIS": ["REVIEW", "ARCHIVED"],
    "REVIEW": ["FINALIZED", "ANALYSIS", "ARCHIVED"],
    "FINALIZED": ["ARCHIVED"],
    "ARCHIVED": []
}

class CaseManager:
    @staticmethod
    def can_transition(current: str, target: str) -> bool:
        return target in VALID_CASE_TRANSITIONS.get(current, [])

    @staticmethod
    async def update_status(db: Session, case: ForensicCase, new_status: str, operator_id: uuid.UUID, reason: str = None):
        current_status = case.status
        
        if not CaseManager.can_transition(current_status, new_status):
            await logger.error("invalid_case_transition", case_id=str(case.id), current=current_status, target=new_status)
            return False

        await logger.info("case_status_transition", case_id=str(case.id), from_state=current_status, to_state=new_status)

        case.status = new_status
        case.updated_at = datetime.now(timezone.utc)
        
        # In a real impl, we'd also log this to a specialized transition table
        db.add(case)
        db.commit()
        db.refresh(case)
        return True

    @staticmethod
    async def log_custody(db: Session, evidence_id: uuid.UUID, operator_id: uuid.UUID, action: str, reason: str = None):
        coc = ChainOfCustody(
            evidence_item_id=evidence_id,
            action=action,
            operator_id=operator_id,
            reason=reason,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(coc)
        db.commit()
        await logger.info("custody_event_logged", evidence_id=str(evidence_id), action=action)
        return coc
