from typing import Dict, Any, List
from sqlmodel import Session
from ..models.models import GeneratedLab
import structlog

logger = structlog.get_logger()

VALID_TRANSITIONS = {
    "REQUESTED": ["VALIDATED", "FAILED"],
    "VALIDATED": ["QUEUED", "FAILED"],
    "QUEUED": ["PROV_NETWORK", "FAILED"],
    "PROV_NETWORK": ["PROV_NODES", "FAILED"],
    "PROV_NODES": ["CONFIGURING", "FAILED"],
    "CONFIGURING": ["ACTIVE", "FAILED"],
    "ACTIVE": ["RESETTING", "DESTROYED", "FAILED"],
    "RESETTING": ["ACTIVE", "FAILED"],
    "FAILED": ["DESTROYED", "QUEUED"], # Queued used for retry
    "DESTROYED": []
}

class MissionLifecycleManager:
    @staticmethod
    def can_transition(current: str, target: str) -> bool:
        if current == target:
            return True
        return target in VALID_TRANSITIONS.get(current, [])

    @staticmethod
    async def transition_to(db: Session, lab: GeneratedLab, target_state: str, reason: str = None):
        current_state = lab.status
        if not MissionLifecycleManager.can_transition(current_state, target_state):
            await logger.error("invalid_state_transition", lab_id=str(lab.id), current=current_state, target=target_state)
            return False

        await logger.info("mission_state_transition", lab_id=str(lab.id), from_state=current_state, to_state=target_state)

        # Update Lab State
        lab.status = target_state
        
        # Update Lifecycle Context
        ctx = lab.lifecycle_context or {}
        if reason:
            ctx["last_reason"] = reason
        
        history = ctx.get("history", [])
        history.append({
            "state": target_state,
            "timestamp": "now", # In real impl, use ISO string
            "reason": reason
        })
        ctx["history"] = history
        lab.lifecycle_context = ctx
        
        db.add(lab)
        db.commit()
        db.refresh(lab)
        
        # In real impl, trigger Telemetry Event here
        return True
