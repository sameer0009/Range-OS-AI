from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ...models.models import GeneratedLab, LabTemplate, LabTask
from ...core.database import get_session

router = APIRouter()

@router.post("/instantiate/{template_id}", response_model=GeneratedLab)
def instantiate_lab(template_id: str, owner_id: str, db: Session = Depends(get_session)):
    template = db.get(LabTemplate, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="TEMPLATE_NOT_FOUND")
    
    # 1. Create DB Record
    lab = GeneratedLab(
        template_id=template.id,
        owner_id=owner_id,
        status="PROVISIONING"
    )
    db.add(lab)
    db.commit()
    db.refresh(lab)

    # 2. Trigger Initial Deploy Task
    deploy_task = LabTask(
        lab_id=lab.id,
        type="DEPLOY",
        status="PENDING",
        progress=0
    )
    db.add(deploy_task)
    db.commit()

    return lab

@router.get("/{lab_id}", response_model=GeneratedLab)
def get_lab_state(lab_id: str, db: Session = Depends(get_session)):
    lab = db.get(GeneratedLab, lab_id)
    if not lab:
        raise HTTPException(status_code=404, detail="LAB_NOT_FOUND")
    return lab
