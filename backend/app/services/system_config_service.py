import os
import shutil
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.system_config import SystemConfig
from app.config import settings


DEFAULT_VALUES = {
    'nombre_negocio': 'RMotos',
    'nit': '',
    'telefono': '',
    'email': '',
    'direccion': '',
    'ciudad': '',
    'logo': None,
    'moneda': 'COP',
    'simbolo_moneda': '$',
}


def get(db: Session) -> SystemConfig:
    config = db.query(SystemConfig).first()
    if not config:
        config = SystemConfig(**DEFAULT_VALUES)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


def update(db: Session, data) -> SystemConfig:
    config = get(db)
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(config, key):
            setattr(config, key, value)
    
    db.commit()
    db.refresh(config)
    return config


def backup_database(db: Session) -> str:
    db_url = settings.DATABASE_URL
    if not db_url.startswith('sqlite:///'):
        raise ValueError('Solo se soporta backup de SQLite')
    
    db_path = db_url.replace('sqlite:///', '')
    if db_path == ':memory:' or not os.path.exists(db_path):
        raise ValueError('Base de datos no disponible para backup')
    
    os.makedirs('backups', exist_ok=True)
    timestamp = datetime.now().strftime('%Y_%m_%d_%H%M%S')
    backup_path = os.path.join('backups', f'rmotos_{timestamp}.db')
    shutil.copy2(db_path, backup_path)
    return backup_path


def restore_database(db: Session, backup_path: str) -> bool:
    db_url = settings.DATABASE_URL
    if not db_url.startswith('sqlite:///'):
        raise ValueError('Solo se soporta restore de SQLite')
    
    db_path = db_url.replace('sqlite:///', '')
    if db_path == ':memory:':
        raise ValueError('No se puede restaurar base de datos en memoria')
    
    if not os.path.exists(backup_path):
        raise ValueError('Archivo de backup no encontrado')
    
    db.close()
    shutil.copy2(backup_path, db_path)
    return True
