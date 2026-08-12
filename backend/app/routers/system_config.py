import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.system_config import SystemConfigResponse, SystemConfigUpdate
from app.services import system_config_service

router = APIRouter(prefix='/configuracion', tags=['configuracion'], dependencies=[Depends(get_current_active_user)])

require_configuracion = require_permission('configuracion')


@router.get('', response_model=SystemConfigResponse)
def get_configuracion(
    db: Session = Depends(get_db),
    _: None = Depends(require_configuracion),
):
    return system_config_service.get(db)


@router.put('', response_model=SystemConfigResponse)
def update_configuracion(
    config_in: SystemConfigUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(require_configuracion),
):
    return system_config_service.update(db, config_in)


@router.post('/backup')
def backup_configuracion(
    db: Session = Depends(get_db),
    _: None = Depends(require_configuracion),
):
    try:
        backup_path = system_config_service.backup_database(db)
        return {'backup_path': backup_path}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post('/restore')
def restore_configuracion(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: None = Depends(require_configuracion),
):
    try:
        temp_path = f'temp_{file.filename}'
        with open(temp_path, 'wb') as f:
            f.write(file.file.read())
        
        result = system_config_service.restore_database(db, temp_path)
        os.remove(temp_path)
        return {'message': 'Base de datos restaurada correctamente'}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
