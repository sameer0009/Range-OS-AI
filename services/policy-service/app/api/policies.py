from typing import Any, List, Dict
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.engine import PolicyEngine
from app.models.models import PolicyProfile, PolicyRule, PolicyEvaluation, ApprovalRequest, PolicyViolation

router = APIRouter()

@router.get("/profiles", response_model=List[PolicyProfile])
def read_profiles(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    statement = select(PolicyProfile).offset(skip).limit(limit)
    return db.exec(statement).all()

@router.post("/evaluate")
def evaluate_action(
    *,
    db: Session = Depends(get_session),
    user_id: UUID,
    action: str,
    context: Dict
) -> Any:
    """
    Evaluate an action against the user's policy profile.
    """
    # 1. Fetch rules for the action (Assuming profile logic is simplified for MVP)
    # In a real system, we'd lookup the user's specific profile assignment.
    statement = select(PolicyRule).where(PolicyRule.action_type == action)
    rules = db.exec(statement).all()
    
    # 2. Run engine
    decision, reason, matched_rule = PolicyEngine.evaluate(rules, context)
    
    # 3. Record evaluation
    evaluation = PolicyEvaluation(
        user_id=user_id,
        action_requested=action,
        decision=decision,
        reason=reason,
        enforced_rule_id=matched_rule.id if matched_rule else None
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    # 4. Handle special states
    approval_id = None
    if decision == "APPROVAL_REQUIRED":
        approval = ApprovalRequest(evaluation_id=evaluation.id, request_details=context)
        db.add(approval)
        db.commit()
        db.refresh(approval)
        approval_id = approval.id

    return {
        "decision": decision,
        "reason": reason,
        "evaluation_id": evaluation.id,
        "approval_request_id": approval_id
    }

@router.get("/violations", response_model=List[PolicyViolation])
def read_violations(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    statement = select(PolicyViolation).offset(skip).limit(limit)
    return db.exec(statement).all()
