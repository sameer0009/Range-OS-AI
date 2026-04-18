from typing import Optional, List
from uuid import UUID
from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password
from app.models.models import User, UserRoleLink, Role
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser:
    def get(self, db: Session, id: UUID) -> Optional[User]:
        return db.get(User, id)

    def get_by_username(self, db: Session, username: str) -> Optional[User]:
        statement = select(User).where(User.username == username)
        return db.exec(statement).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        statement = select(User).where(User.email == email)
        return db.exec(statement).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_active=obj_in.is_active,
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[User]:
        user = self.get_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

crud_user = CRUDUser()
