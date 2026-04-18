from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.api import deps
from app.core.db import get_session
from app.models.models import Role
from app.schemas.role import RoleOut

router = APIRouter()

@router.get("/", response_model=List[RoleOut])
def read_roles(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve roles. (Superuser only)
    """
    statement = select(Role).offset(skip).limit(limit)
    roles = db.exec(statement).all()
    return roles
