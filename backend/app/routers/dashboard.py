from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.dashboard import (
    ResumenResponse,
    VentasResponse,
    ProductosResponse,
    FinanzasResponse,
)
from app.services import dashboard_service

router = APIRouter(prefix='/dashboard', tags=['dashboard'], dependencies=[Depends(get_current_active_user)])

require_dashboard = require_permission('dashboard')


@router.get('/resumen', response_model=ResumenResponse, dependencies=[Depends(require_dashboard)])
def get_resumen(db: Session = Depends(get_db)):
    return dashboard_service.get_resumen(db)


@router.get('/ventas', response_model=VentasResponse, dependencies=[Depends(require_dashboard)])
def get_ventas(
    fecha_inicio: datetime | None = Query(None),
    fecha_fin: datetime | None = Query(None),
    db: Session = Depends(get_db),
):
    return dashboard_service.get_ventas_por_dia(db, fecha_inicio, fecha_fin)


@router.get('/productos', response_model=ProductosResponse, dependencies=[Depends(require_dashboard)])
def get_productos(db: Session = Depends(get_db)):
    return dashboard_service.get_productos(db)


@router.get('/finanzas', response_model=FinanzasResponse, dependencies=[Depends(require_dashboard)])
def get_finanzas(db: Session = Depends(get_db)):
    return dashboard_service.get_finanzas(db)