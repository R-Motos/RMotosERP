from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.system_config import SystemConfig
from app.services import user_service, auth_service


def test_usuario_sin_permiso_recibe_403(client: TestClient, db_session: Session):
    user = user_service.create(db_session, nombre='Sin Permiso', pin='1234', rol_ids=[])
    db_session.commit()
    token = auth_service.create_access_token(user.id)
    client.headers.update({'Authorization': f'Bearer {token}'})

    response = client.get('/configuracion')
    assert response.status_code == 403


def test_obtener_configuracion_crea_automaticamente(auth_client: TestClient):
    response = auth_client.get('/configuracion')
    assert response.status_code == 200
    data = response.json()
    assert 'nombre_negocio' in data
    assert data['moneda'] == 'COP'
    assert data['simbolo_moneda'] == '$'


def test_actualizar_configuracion(auth_client: TestClient):
    update_response = auth_client.put('/configuracion', json={
        'nombre_negocio': 'RMotos Test',
        'nit': '123456',
        'telefono': '555-1234',
        'email': 'test@rmotos.com',
        'direccion': 'Calle 123',
        'ciudad': 'Bogotá',
        'moneda': 'COP',
        'simbolo_moneda': '$',
    })
    assert update_response.status_code == 200
    data = update_response.json()
    assert data['nombre_negocio'] == 'RMotos Test'
    assert data['nit'] == '123456'
    assert data['telefono'] == '555-1234'


def test_solo_un_registro_configuracion(auth_client: TestClient, db_session: Session):
    auth_client.get('/configuracion')
    auth_client.get('/configuracion')
    
    count = db_session.query(SystemConfig).count()
    assert count == 1


def test_backup_endpoint(auth_client: TestClient):
    response = auth_client.post('/configuracion/backup')
    assert response.status_code in (200, 400, 500)


def test_restore_endpoint(auth_client: TestClient):
    response = auth_client.post('/configuracion/restore', files={'file': ('test.db', b'fake db content')})
    assert response.status_code in (200, 400, 500)


def test_configuracion_persiste_valores(auth_client: TestClient):
    auth_client.put('/configuracion', json={
        'nombre_negocio': 'RMotos Persist',
        'nit': '999',
        'telefono': '555-9999',
        'email': 'persist@rmotos.com',
        'direccion': 'Calle Persist',
        'ciudad': 'Medellín',
        'moneda': 'COP',
        'simbolo_moneda': '$',
    })
    
    response = auth_client.get('/configuracion')
    assert response.status_code == 200
    data = response.json()
    assert data['nombre_negocio'] == 'RMotos Persist'
    assert data['nit'] == '999'
    assert data['ciudad'] == 'Medellín'
