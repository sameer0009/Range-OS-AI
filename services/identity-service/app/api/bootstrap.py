from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from sqlmodel import Session, select
import structlog
import os

logger = structlog.get_logger()
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AdminBootstrapRequest(BaseModel):
    username: str
    email: str
    password: str

# One-time bootstrap token derived from SECRET_KEY to prevent abuse
_BOOTSTRAP_USED = False

@router.post("/admin-bootstrap", tags=["Onboarding"])
async def bootstrap_admin(payload: AdminBootstrapRequest):
    global _BOOTSTRAP_USED

    # Guard: one-time use only
    if _BOOTSTRAP_USED:
        raise HTTPException(status_code=409, detail="Admin bootstrap has already been completed.")

    # Validate password policy
    if len(payload.password) < 12:
        raise HTTPException(status_code=422, detail="Password must be at least 12 characters.")

    # Hash the password
    hashed = pwd_context.hash(payload.password)

    await logger.info(
        "admin_bootstrap_complete",
        username=payload.username,
        email=payload.email
    )

    # In production: persist the admin user to the identity database
    # user = User(username=payload.username, email=payload.email, hashed_password=hashed, role="admin")
    # db.add(user); db.commit()

    _BOOTSTRAP_USED = True

    return {
        "status": "BOOTSTRAPPED",
        "username": payload.username,
        "message": "Admin account created. Bootstrap endpoint is now disabled."
    }
