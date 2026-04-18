from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.models import GeneratedLab, LabTask

router = APIRouter()

@router.get("/", response_model=List[GeneratedLab])
def read_labs(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve instantiated labs.
    """
    statement = select(GeneratedLab).offset(skip).limit(limit)
    labs = db.exec(statement).all()
    return labs

@router.post("/", response_model=GeneratedLab)
def create_lab(
    *,
    db: Session = Depends(get_session),
    lab_in: GeneratedLab,
) -> Any:
    """
    Instantiate a lab from a template.
    """
    db.add(lab_in)
    db.commit()
    db.refresh(lab_in)
    return lab_in

@router.get("/{id}", response_model=GeneratedLab)
def read_lab(
    *,
    db: Session = Depends(get_session),
    id: UUID,
) -> Any:
    """
    Get lab by ID.
    """
    lab = db.get(GeneratedLab, id)
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    return lab

@router.post("/{id}/reset")
def reset_lab(
    *,
    db: Session = Depends(get_session),
    id: UUID,
) -> Any:
    """
    Trigger a metadata reset for a lab.
    """
    lab = db.get(GeneratedLab, id)
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    
    # Create a task for tracking the reset operation
    task = LabTask(lab_id=id, type="RESET", status="Pending")
    db.add(task)
    db.commit()
    
    return {"status": "success", "task_id": task.id}
