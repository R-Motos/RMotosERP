from decimal import Decimal
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.product import Producto
from app.models.client import Cliente
from app.services import user_service, auth_service


def test_usuario_autorizado_puede_consultar_dashboard(auth_client: TestClient):
    response = auth_client.get('/dashboard/resumen')
    assert response.status_code == 200


def test_usuario_sin_permiso_recibe_403(client: TestClient, db_session: Session):
    user = user_service.create(db_session, nombre='Sin Permiso', pin='1234', rol_ids=[])
    db_session.commit()
    token = auth_service.create_access_token(user.id)
    client.headers.update({'Authorization': f'Bearer {token}'})

    response = client.get('/dashboard/resumen')
    assert response.status_code == 403


def test_resumen_devuelve_estructura_correcta(auth_client: TestClient):
    response = auth_client.get('/dashboard/resumen')
    assert response.status_code == 200
    data = response.json()
    assert 'ventas' in data
    assert 'inventario' in data
    assert 'clientes' in data
    assert 'finanzas' in data
    assert 'cantidad_ventas' in data['ventas']
    assert 'total_vendido' in data['ventas']
    assert 'promedio_venta' in data['ventas']
    assert 'cantidad_productos' in data['inventario']
    assert 'productos_bajo_stock' in data['inventario']
    assert 'valor_inventario' in data['inventario']
    assert 'cantidad_clientes' in data['clientes']
    assert 'clientes_con_compras' in data['clientes']
    assert 'ingresos_totales' in data['finanzas']
    assert 'egresos_totales' in data['finanzas']
    assert 'balance' in data['finanzas']


def test_calculo_balance_correcto(auth_client: TestClient):
    response = auth_client.get('/dashboard/resumen')
    assert response.status_code == 200
    data = response.json()
    ingresos = Decimal(data['finanzas']['ingresos_totales'])
    egresos = Decimal(data['finanzas']['egresos_totales'])
    balance = Decimal(data['finanzas']['balance'])
    assert balance == ingresos - egresos


def test_filtros_fecha_funcionan(auth_client: TestClient):
    hoy = datetime.utcnow()
    fecha_inicio = hoy - timedelta(days=30)
    fecha_fin = hoy

    response = auth_client.get('/dashboard/ventas', params={
        'fecha_inicio': fecha_inicio.isoformat(),
        'fecha_fin': fecha_fin.isoformat(),
    })
    assert response.status_code == 200
    data = response.json()
    assert 'items' in data
    assert 'total' in data


def test_productos_bajo_stock_funcionan(auth_client: TestClient, db_session: Session):
    db_session.query(Producto).filter(Producto.nombre == 'Producto Bajo Stock Dashboard').delete()
    db_session.commit()

    producto = Producto(
        nombre='Producto Bajo Stock Dashboard',
        precio_compra=10,
        precio_venta=20,
        cantidad_disponible=1,
        stock_minimo=5,
        estado='publicado',
    )
    db_session.add(producto)
    db_session.commit()

    response = auth_client.get('/dashboard/productos')
    assert response.status_code == 200
    data = response.json()
    assert len(data['bajo_stock']) >= 1
    assert any(p['id'] == producto.id for p in data['bajo_stock'])


def test_ventas_agrupadas_correctamente(auth_client: TestClient):
    response = auth_client.get('/dashboard/ventas')
    assert response.status_code == 200
    data = response.json()
    assert 'items' in data
    assert 'total' in data
    if data['total'] > 0:
        item = data['items'][0]
        assert 'fecha' in item
        assert 'total_vendido' in item
        assert 'cantidad_ventas' in item
