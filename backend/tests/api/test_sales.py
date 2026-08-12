from decimal import Decimal


def test_crear_venta_correctamente(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Venta',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    assert response.status_code == 201
    data = response.json()
    assert data['estado'] == 'completada'
    assert Decimal(data['total']) == Decimal('40')
    assert len(data['detalles']) == 1


def test_venta_con_cliente(auth_client):
    cliente = auth_client.post('/clientes/', json={'nombre': 'Cliente Venta'})
    cliente_id = cliente.json()['id']
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Cliente',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'cliente_id': cliente_id,
        'metodo_pago': 'tarjeta',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 1, 'precio_unitario': 20},
        ],
    })
    assert response.status_code == 201
    assert response.json()['cliente_id'] == cliente_id


def test_venta_sin_cliente(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Sin Cliente',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 1, 'precio_unitario': 20},
        ],
    })
    assert response.status_code == 201
    assert response.json()['cliente_id'] is None


def test_calculo_total_con_descuento(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Descuento',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'descuento': 5,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    assert response.status_code == 201
    data = response.json()
    assert Decimal(data['subtotal']) == Decimal('40')
    assert Decimal(data['descuento']) == Decimal('5')
    assert Decimal(data['total']) == Decimal('35')


def test_venta_multiple_productos(auth_client):
    producto1 = auth_client.post('/productos/', json={
        'nombre': 'Prod Multi 1',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto1_id = producto1.json()['id']

    producto2 = auth_client.post('/productos/', json={
        'nombre': 'Prod Multi 2',
        'precio_compra': 15,
        'precio_venta': 30,
        'cantidad_disponible': 10,
    })
    producto2_id = producto2.json()['id']

    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto1_id, 'cantidad': 1, 'precio_unitario': 20},
            {'producto_id': producto2_id, 'cantidad': 2, 'precio_unitario': 30},
        ],
    })
    assert response.status_code == 201
    data = response.json()
    assert Decimal(data['subtotal']) == Decimal('80')
    assert Decimal(data['total']) == Decimal('80')


def test_venta_stock_insuficiente(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Stock Bajo',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 1,
    })
    producto_id = producto.json()['id']

    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 5, 'precio_unitario': 20},
        ],
    })
    assert response.status_code == 400
    assert 'stock' in response.json()['message'].lower() or 'insuficiente' in response.json()['message'].lower()


def test_venta_producto_inexistente(auth_client):
    response = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': 999, 'cantidad': 1, 'precio_unitario': 20},
        ],
    })
    assert response.status_code == 400
    assert 'producto' in response.json()['message'].lower()


def test_anulacion_venta_devuelve_stock(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Anular',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    venta = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 3, 'precio_unitario': 20},
        ],
    })
    assert venta.status_code == 201
    venta = venta.json()

    auth_client.put(f'/ventas/{venta["id"]}', json={'estado': 'anulada'})
    assert auth_client.get(f'/ventas/{venta["id"]}').json()['estado'] == 'anulada'

    producto = auth_client.get(f'/productos/{producto_id}').json()
    assert Decimal(producto['cantidad_disponible']) == Decimal('10')


def test_movimiento_inventario_generado(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Mov',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    venta = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    assert venta.status_code == 201
    venta = venta.json()

    movimientos = auth_client.get('/movimientos/').json()
    assert len(movimientos) >= 1
    assert movimientos[0]['tipo'] == 'salida'
    assert movimientos[0]['referencia'] == f'venta_{venta["id"]}'


def test_listar_ventas(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod List',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 1, 'precio_unitario': 20},
        ],
    })

    response = auth_client.get('/ventas/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_obtener_venta(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Get',
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
    venta = venta.json()

    response = auth_client.get(f'/ventas/{venta["id"]}')
    assert response.status_code == 200
    assert response.json()['id'] == venta['id']
