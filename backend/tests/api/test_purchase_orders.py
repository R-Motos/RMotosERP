from decimal import Decimal


def test_create_orden_compra(auth_client):
    proveedor = auth_client.post('/proveedores/', json={'nombre': 'Proveedor OC Test'})
    proveedor_id = proveedor.json()['id']

    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod OC',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']

    response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': proveedor_id,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 201
    data = response.json()
    assert data['numero'].startswith('OC-')
    assert Decimal(data['total']) == Decimal('1000')
    assert len(data['detalles']) == 1


def test_create_orden_compra_sin_productos(auth_client):
    response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [],
    })
    assert response.status_code == 400
    assert 'al menos un producto' in response.json()['message'].lower()


def test_create_orden_compra_producto_repetido(auth_client):
    auth_client.post('/productos/', json={
        'nombre': 'Prod Repetido',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad': 1, 'precio_unitario': 10},
            {'producto_id': 1, 'cantidad': 1, 'precio_unitario': 10},
        ],
    })
    assert response.status_code == 400
    assert 'repetido' in response.json()['message'].lower()


def test_listar_ordenes_compra(auth_client):
    auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad': 5, 'precio_unitario': 50},
        ],
    })
    response = auth_client.get('/ordenes-compra/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_obtener_orden_compra(auth_client):
    create_response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad': 3, 'precio_unitario': 30},
        ],
    })
    orden_id = create_response.json()['id']
    response = auth_client.get(f'/ordenes-compra/{orden_id}')
    assert response.status_code == 200
    assert response.json()['id'] == orden_id


def test_update_orden_compra_borrador(auth_client):
    create_response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'borrador',
        'detalles': [
            {'producto_id': 1, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    orden_id = create_response.json()['id']
    response = auth_client.put(f'/ordenes-compra/{orden_id}', json={'observaciones': 'Actualizada'})
    assert response.status_code == 200
    assert response.json()['observaciones'] == 'Actualizada'


def test_impedir_modificar_orden_completada(auth_client):
    create_response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'borrador',
        'detalles': [
            {'producto_id': 1, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    orden_id = create_response.json()['id']
    auth_client.put(f'/ordenes-compra/{orden_id}', json={'estado': 'completada'})
    response = auth_client.put(f'/ordenes-compra/{orden_id}', json={'observaciones': 'No debe pasar'})
    assert response.status_code == 400
    assert 'no se puede modificar' in response.json()['message'].lower()


def test_impedir_modificar_orden_cancelada(auth_client):
    create_response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'borrador',
        'detalles': [
            {'producto_id': 1, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    orden_id = create_response.json()['id']
    auth_client.put(f'/ordenes-compra/{orden_id}', json={'estado': 'cancelada'})
    response = auth_client.put(f'/ordenes-compra/{orden_id}', json={'observaciones': 'No debe pasar'})
    assert response.status_code == 400
    assert 'no se puede modificar' in response.json()['message'].lower()


def test_calculo_total(auth_client):
    producto1 = auth_client.post('/productos/', json={
        'nombre': 'Prod Total 1',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto1_id = producto1.json()['id']

    producto2 = auth_client.post('/productos/', json={
        'nombre': 'Prod Total 2',
        'precio_compra': 15,
        'precio_venta': 30,
    })
    producto2_id = producto2.json()['id']

    auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto1_id, 'cantidad': 2, 'precio_unitario': 10},
            {'producto_id': producto2_id, 'cantidad': 3, 'precio_unitario': 20},
        ],
    })
    response = auth_client.get('/ordenes-compra/')
    orden = response.json()[0]
    assert Decimal(orden['total']) == Decimal('80')


def test_proveedor_inexistente(auth_client):
    response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 999,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad': 1, 'precio_unitario': 10},
        ],
    })
    assert response.status_code == 400
    assert 'proveedor' in response.json()['message'].lower()


def test_producto_inexistente(auth_client):
    response = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 999, 'cantidad': 1, 'precio_unitario': 10},
        ],
    })
    assert response.status_code == 400
    assert 'producto' in response.json()['message'].lower()
