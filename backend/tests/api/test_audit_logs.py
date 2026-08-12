from decimal import Decimal
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.product import Producto
from app.models.client import Cliente
from app.models.user import User
from app.services import user_service, auth_service


def test_usuario_sin_permiso_recibe_403(client: TestClient, db_session: Session):
    user = user_service.create(db_session, nombre='Sin Permiso', pin='1234', rol_ids=[])
    db_session.commit()
    token = auth_service.create_access_token(user.id)
    client.headers.update({'Authorization': f'Bearer {token}'})

    response = client.get('/audit')
    assert response.status_code == 403


def test_registro_creado_en_crear_producto(auth_client: TestClient):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Audit',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    assert producto.status_code == 201
    producto_id = producto.json()['id']

    response = auth_client.get('/audit', params={'modulo': 'productos', 'accion': 'crear'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1
    assert data['items'][0]['modulo'] == 'productos'
    assert data['items'][0]['accion'] == 'crear'
    assert data['items'][0]['registro_id'] == producto_id


def test_registro_creado_en_editar_producto(auth_client: TestClient):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Audit Edit',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    auth_client.put(f'/productos/{producto_id}', json={'nombre': 'Prod Audit Editado'})

    response = auth_client.get('/audit', params={'modulo': 'productos', 'accion': 'editar'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1
    assert data['items'][0]['modulo'] == 'productos'
    assert data['items'][0]['accion'] == 'editar'


def test_registro_creado_en_crear_venta(auth_client: TestClient):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Venta Audit',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    venta = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 1, 'precio_unitario': 20},
        ],
    })
    assert venta.status_code == 201
    venta_id = venta.json()['id']

    response = auth_client.get('/audit', params={'modulo': 'ventas', 'accion': 'crear'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1
    assert data['items'][0]['modulo'] == 'ventas'
    assert data['items'][0]['accion'] == 'crear'
    assert data['items'][0]['registro_id'] == venta_id


def test_registro_creado_en_anular_venta(auth_client: TestClient):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Anular Audit',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    venta = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 1, 'precio_unitario': 20},
        ],
    })
    venta_id = venta.json()['id']

    auth_client.put(f'/ventas/{venta_id}', json={'estado': 'anulada'})

    response = auth_client.get('/audit', params={'modulo': 'ventas', 'accion': 'anular'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1
    assert data['items'][0]['modulo'] == 'ventas'
    assert data['items'][0]['accion'] == 'anular'
    assert data['items'][0]['registro_id'] == venta_id


def test_registro_creado_en_crear_usuario(auth_client: TestClient):
    user = auth_client.post('/usuarios/', json={
        'nombre': 'Usuario Audit',
        'pin': '1234',
    })
    assert user.status_code == 201
    user_id = user.json()['id']

    response = auth_client.get('/audit', params={'modulo': 'usuarios', 'accion': 'crear'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1
    assert data['items'][0]['modulo'] == 'usuarios'
    assert data['items'][0]['accion'] == 'crear'
    assert data['items'][0]['registro_id'] == user_id


def test_filtros_funcionan(auth_client: TestClient, db_session: Session):
    auth_client.post('/productos/', json={
        'nombre': 'Prod Filtro Audit',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })

    response = auth_client.get('/audit', params={'modulo': 'productos'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1

    response = auth_client.get('/audit', params={'accion': 'crear'})
    assert response.status_code == 200
    data = response.json()
    assert data['total'] >= 1


def test_obtener_registro_auditoria(auth_client: TestClient):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Get Audit',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    response = auth_client.get('/audit', params={'modulo': 'productos', 'accion': 'crear'})
    audit_id = response.json()['items'][0]['id']

    response = auth_client.get(f'/audit/{audit_id}')
    assert response.status_code == 200
    data = response.json()
    assert data['id'] == audit_id
    assert data['registro_id'] == producto_id
    assert data['modulo'] == 'productos'
