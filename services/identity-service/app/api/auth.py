from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.db import get_session
from app.crud.crud_user import crud_user
from app.crud.crud_session import crud_session
from app.schemas.token import Token
from app.schemas.user import UserOut

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_session), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, retrieve an access token for future requests
    """
    user = crud_user.authenticate(
        db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    # Store session in DB
    crud_session.create_session(
        db,
        user_id=user.id,
        session_key=token, # Using token as key for simplicity in MVP
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/logout")
def logout(
    token: str = Depends(deps.reusable_oauth2),
    db: Session = Depends(get_session),
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Log out and revoke the current session
    """
    success = crud_session.deactivate_session(db, token)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found or already inactive")
    return {"status": "success", "message": "Session terminated"}

@router.get("/me", response_model=UserOut)
def read_user_me(
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
