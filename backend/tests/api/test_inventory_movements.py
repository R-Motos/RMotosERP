from decimal import Decimal

def test_create_entrada(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto Movimiento',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    producto_id = create_product.json()['id']

    response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'entrada',
        'cantidad': 5,
        'usuario_id': 1,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['tipo'] == 'entrada'
    assert Decimal(data['cantidad']) == Decimal('5')
    assert data['producto_id'] == producto_id


def test_create_salida(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto Salida',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
        'cantidad_disponible': 10,
    })
    producto_id = create_product.json()['id']

    response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'salida',
        'cantidad': 3,
        'usuario_id': 1,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['tipo'] == 'salida'
    assert Decimal(data['cantidad']) == Decimal('3')


def test_create_ajuste_positivo(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto Ajuste Pos',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    producto_id = create_product.json()['id']

    response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'ajuste',
        'cantidad': 2,
        'usuario_id': 1,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['tipo'] == 'ajuste'
    assert Decimal(data['cantidad']) == Decimal('2')


def test_create_ajuste_negativo(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto Ajuste Neg',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
        'cantidad_disponible': 10,
    })
    producto_id = create_product.json()['id']

    response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'ajuste',
        'cantidad': -2,
        'usuario_id': 1,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['tipo'] == 'ajuste'
    assert Decimal(data['cantidad']) == Decimal('-2')


def test_impedir_inventario_negativo(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto Stock Bajo',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
        'cantidad_disponible': 5,
    })
    producto_id = create_product.json()['id']

    response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'salida',
        'cantidad': 10,
        'usuario_id': 1,
    })
    assert response.status_code == 400
    assert 'negativo' in response.json()['message'].lower()


def test_listar_movimientos(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto List',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    producto_id = create_product.json()['id']

    auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'entrada',
        'cantidad': 5,
        'usuario_id': 1,
    })

    response = auth_client.get('/movimientos/')
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_obtener_movimiento(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto Get',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    producto_id = create_product.json()['id']

    create_response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'entrada',
        'cantidad': 5,
        'usuario_id': 1,
    })
    movimiento_id = create_response.json()['id']

    response = auth_client.get(f'/movimientos/{movimiento_id}')
    assert response.status_code == 200
    assert response.json()['id'] == movimiento_id


def test_movimiento_producto_inexistente(auth_client):
    response = auth_client.post('/movimientos/', json={
        'producto_id': 999,
        'tipo': 'entrada',
        'cantidad': 5,
        'usuario_id': 1,
    })
    assert response.status_code == 400
    assert 'producto' in response.json()['message'].lower()


def test_movimiento_usuario_inexistente(auth_client):
    create_product = auth_client.post('/productos/', json={
        'nombre': 'Producto User Fail',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    producto_id = create_product.json()['id']

    response = auth_client.post('/movimientos/', json={
        'producto_id': producto_id,
        'tipo': 'entrada',
        'cantidad': 5,
        'usuario_id': 999,
    })
    assert response.status_code == 400
    assert 'usuario' in response.json()['message'].lower()
