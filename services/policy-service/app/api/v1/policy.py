from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Dict, Any
from ...models.models import PolicyProfile, PolicyRule, PolicyEvaluation
from ...core.engine import TacticalRuleEngine
from ...core.database import get_session # Implementation assumed

router = APIRouter()

@router.post("/evaluate")
async def evaluate_policy(
    payload: Dict[str, Any],
    db: Session = Depends(get_session)
):
    user_id = payload.get("user_id")
    action = payload.get("action")
    context = payload.get("context", {})

    if not user_id or not action:
        raise HTTPException(status_code=400, detail="MISSING_IDENTITY_OR_ACTION")

    # 1. Fetch Active Rules
    # In a real scenario, we'd fetch rules linked to the user's assigned profile.
    # For now, evaluate all active rules in the system.
    rules = db.exec(select(PolicyRule)).all()
    
    # 2. Engage Engine
    engine = TacticalRuleEngine(rules)
    decision = engine.evaluate(context)

    # 3. Audit Log the Evaluation
    evaluation = PolicyEvaluation(
        user_id=user_id,
        action_requested=action,
        decision=decision,
        reason=f"Evaluation triggered for {action} via Tactical Engine."
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    return {
        "status": "SUCCESS",
        "decision": decision,
        "evaluation_id": str(evaluation.id)
    }
