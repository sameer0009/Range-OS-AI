from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.models import LabTemplate

router = APIRouter()

@router.get("/", response_model=List[LabTemplate])
def read_templates(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve lab templates.
    """
    statement = select(LabTemplate).offset(skip).limit(limit)
    templates = db.exec(statement).all()
    return templates

@router.post("/", response_model=LabTemplate)
def create_template(
    *,
    db: Session = Depends(get_session),
    template_in: LabTemplate,
) -> Any:
    """
    Create a new lab template.
    """
    db.add(template_in)
    db.commit()
    db.refresh(template_in)
    return template_in

@router.get("/{id}", response_model=LabTemplate)
def read_template(
    *,
    db: Session = Depends(get_session),
    id: UUID,
) -> Any:
    """
    Get lab template by ID.
    """
    template = db.get(LabTemplate, id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
