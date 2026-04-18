from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ...models.models import LabTemplate
from ...core.database import get_session

router = APIRouter()

@router.get("/", response_model=List[LabTemplate])
def list_templates(db: Session = Depends(get_session)):
    return db.exec(select(LabTemplate)).all()

@router.post("/", response_model=LabTemplate)
def create_template(template: LabTemplate, db: Session = Depends(get_session)):
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.get("/{template_id}", response_model=LabTemplate)
def get_template(template_id: str, db: Session = Depends(get_session)):
    template = db.get(LabTemplate, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="TEMPLATE_NOT_FOUND")
    return template
