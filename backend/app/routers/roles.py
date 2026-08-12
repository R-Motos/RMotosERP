from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.role import Role
from app.schemas.role import RoleResponse
from app.services import audit_service

router = APIRouter(prefix='/roles', tags=['roles'])


@router.get('', response_model=list[RoleResponse])
def list_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()
