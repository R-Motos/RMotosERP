import time
from datetime import datetime, timedelta
from typing import Any

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.models.permission import Permission
from app.models.role import rol_permisos
from app.models.user import User, usuario_roles, UsuarioPermisoOverride
from app.services import auth_service, user_service


@pytest.fixture(autouse=True)
def clean_users(db_session: Session):
    db_session.query(UsuarioPermisoOverride).delete()
    db_session.query(User).delete()
    db_session.execute(usuario_roles.delete())
    db_session.commit()
    yield
    db_session.query(UsuarioPermisoOverride).delete()
    db_session.query(User).delete()
    db_session.execute(usuario_roles.delete())
    db_session.commit()


def test_login_correcto(client: TestClient, db_session: Session):
    usuario = user_service.create(db_session, nombre='Test', username='test', pin='AUTH_1111', rol_ids=[1])
    db_session.commit()

    response = client.post('/api/auth/login', json={'username': 'test', 'pin': 'AUTH_1111'})
    assert response.status_code == 200
    data = response.json()
    assert 'access_token' in data
    assert data['token_type'] == 'bearer'
    assert data['expires_in'] == settings.ACCESS_TOKEN_EXPIRE_HOURS * 3600


def test_login_pin_incorrecto(client: TestClient, db_session: Session):
    user_service.create(db_session, nombre='Test', username='test2', pin='AUTH_2222', rol_ids=[1])
    db_session.commit()

    response = client.post('/api/auth/login', json={'username': 'test2', 'pin': 'AUTH_0000'})
    assert response.status_code == 401
    assert response.json()['message'] == 'Credenciales incorrectas'


def test_login_usuario_inactivo(client: TestClient, db_session: Session):
    usuario = user_service.create(db_session, nombre='Test Inactivo', username='test_inactivo', pin='AUTH_3333', estado='inactivo', rol_ids=[1])
    db_session.commit()

    response = client.post('/api/auth/login', json={'username': 'test_inactivo', 'pin': 'AUTH_3333'})
    assert response.status_code == 403
    assert response.json()['message'] == 'Usuario inactivo'


def test_auth_me(client: TestClient, db_session: Session):
    usuario = user_service.create(db_session, nombre='Test', username='test_me', pin='AUTH_4444', rol_ids=[1])
    db_session.commit()

    login_response = client.post('/api/auth/login', json={'username': 'test_me', 'pin': 'AUTH_4444'})
    token = login_response.json()['access_token']

    response = client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    data = response.json()
    assert data['nombre'] == 'Test'
    assert data['username'] == 'test_me'
    assert len(data['roles']) == 1


def test_auth_me_sin_token(client: TestClient):
    response = client.get('/api/auth/me')
    assert response.status_code == 422


def test_token_invalido(client: TestClient):
    response = client.get('/api/auth/me', headers={'Authorization': 'Bearer token_invalido'})
    assert response.status_code == 401
    assert response.json()['message'] == 'Token inválido o expirado'


def test_token_expirado(client: TestClient, db_session: Session):
    usuario = user_service.create(db_session, nombre='Test', username='test_exp', pin='AUTH_5555', rol_ids=[1])
    db_session.commit()

    expire = datetime.utcnow() - timedelta(hours=1)
    payload = {'sub': str(usuario.id), 'exp': expire}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    response = client.get('/api/auth/me', headers={'Authorization': 'Bearer token_invalido'})
    assert response.status_code == 401
    assert response.json()['message'] == 'Token inválido o expirado'


def test_logout(client: TestClient):
    response = client.post('/api/auth/logout')
    assert response.status_code == 204


def test_migracion_pin_antiguo(client: TestClient, db_session: Session):
    usuario = User(nombre='Legacy', username='legacy', pin='AUTH_LEGACY', estado='activo')
    db_session.add(usuario)
    db_session.commit()

    response = client.post('/api/auth/login', json={'username': 'legacy', 'pin': 'AUTH_LEGACY'})
    assert response.status_code == 200

    usuario_actualizado = db_session.query(User).filter(User.id == usuario.id).first()
    assert usuario_actualizado.pin_hash is not None
    assert usuario_actualizado.pin is None


def test_require_permission_modulo_permitido(db_session: Session):
    usuario = user_service.create(db_session, nombre='Test', username='test_perm', pin='AUTH_6666', rol_ids=[1])
    db_session.commit()

    rol = usuario.roles[0]
    permiso = Permission(modulo='productos', accion='ver', descripcion='Ver productos')
    db_session.add(permiso)
    db_session.flush()
    db_session.execute(rol_permisos.insert().values([{'rol_id': rol.id, 'permiso_id': permiso.id}]))
    db_session.commit()

    from app.services import permission_service
    permisos = permission_service.get_user_permissions(db_session, usuario.id)
    modulos = permission_service.get_user_modules(db_session, usuario.id)

    from app.services import auth_service
    modulos_auth = auth_service.get_user_modules(db_session, usuario.id)

    from app.dependencies.auth import require_permission
    import asyncio

    checker = require_permission('productos')
    result = asyncio.run(checker(usuario, db_session))
    assert result == usuario


def test_require_permission_modulo_denegado(db_session: Session):
    usuario = user_service.create(db_session, nombre='Test', username='test_den', pin='AUTH_7777', rol_ids=[2])
    db_session.commit()

    from app.dependencies.auth import require_permission
    import asyncio

    checker = require_permission('finanzas')
    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(checker(usuario, db_session))
    assert exc_info.value.status_code == 403
