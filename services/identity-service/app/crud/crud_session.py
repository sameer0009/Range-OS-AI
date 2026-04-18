from datetime import datetime, timezone, timedelta
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Session, select
from app.models.models import Session as DBSession

class CRUDSession:
    def create_session(
        self, 
        db: Session, 
        *, 
        user_id: UUID, 
        session_key: str, 
        expires_in_minutes: int,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> DBSession:
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)
        db_obj = DBSession(
            user_id=user_id,
            session_key=session_key,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_key(self, db: Session, session_key: str) -> Optional[DBSession]:
        statement = select(DBSession).where(
            DBSession.session_key == session_key,
            DBSession.is_active == True,
            DBSession.expires_at > datetime.now(timezone.utc)
        )
        return db.exec(statement).first()

    def deactivate_session(self, db: Session, session_key: str) -> bool:
        db_session = self.get_by_key(db, session_key)
        if db_session:
            db_session.is_active = False
            db.add(db_session)
            db.commit()
            return True
        return False

crud_session = CRUDSession()
