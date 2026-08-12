from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.audit_log import AuditLogListResponse, AuditLogResponse
from app.services import audit_service

router = APIRouter(prefix='/audit', tags=['audit'], dependencies=[Depends(get_current_active_user)])

require_usuarios = require_permission('usuarios')


@router.get('', response_model=AuditLogListResponse, dependencies=[Depends(require_permission('usuarios'))])
def list_audit_logs(
    usuario_id: int | None = Query(None),
    modulo: str | None = Query(None),
    accion: str | None = Query(None),
    fecha_inicio: datetime | None = Query(None),
    fecha_fin: datetime | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return audit_service.list(db, usuario_id, modulo, accion, fecha_inicio, fecha_fin, page, size)


@router.get('/{audit_id}', response_model=AuditLogResponse, dependencies=[Depends(require_permission('usuarios'))])
def get_audit_log(audit_id: int, db: Session = Depends(get_db)):
    audit_log = audit_service.get(db, audit_id)
    if not audit_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Registro de auditoría no encontrado',
        )
    return audit_log
