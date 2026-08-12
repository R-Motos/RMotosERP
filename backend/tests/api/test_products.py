def test_create_producto(auth_client):
    response = auth_client.post('/productos/', json={
        'nombre': 'Filtro de aceite',
        'sku': 'FIL-001',
        'precio_compra': 10.5,
        'precio_venta': 20.0,
        'estado': 'publicado',
    })
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Filtro de aceite'
    assert data['sku'] == 'FIL-001'
    assert data['estado'] == 'publicado'


def test_get_producto(auth_client):
    create_response = auth_client.post('/productos/', json={
        'nombre': 'Cadena',
        'precio_compra': 15.0,
        'precio_venta': 30.0,
        'estado': 'pendiente',
    })
    producto_id = create_response.json()['id']
    response = auth_client.get(f'/productos/{producto_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Cadena'


def test_list_productos(auth_client):
    response = auth_client.get('/productos/')
    assert response.status_code == 200
    data = response.json()
    assert 'items' in data
    assert 'total' in data


def test_update_producto(auth_client):
    create_response = auth_client.post('/productos/', json={
        'nombre': 'Original',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
        'estado': 'pendiente',
    })
    producto_id = create_response.json()['id']
    response = auth_client.put(f'/productos/{producto_id}', json={'nombre': 'Actualizado'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizado'


def test_search_productos(auth_client):
    auth_client.post('/productos/', json={
        'nombre': 'Filtro',
        'sku': 'ABC123',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    response = auth_client.get('/productos/?q=Filtro')
    assert response.status_code == 200
    assert response.json()['total'] >= 1


def test_filter_by_estado(auth_client):
    response = auth_client.get('/productos/?estado=publicado')
    assert response.status_code == 200


def test_sku_unique(auth_client):
    auth_client.post('/productos/', json={
        'nombre': 'Prod1',
        'sku': 'UNIQUE-1',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    response = auth_client.post('/productos/', json={
        'nombre': 'Prod2',
        'sku': 'UNIQUE-1',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    assert response.status_code == 400


def test_barcode_unique(auth_client):
    auth_client.post('/productos/', json={
        'nombre': 'Prod3',
        'codigo_barras': 'BAR-1',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    response = auth_client.post('/productos/', json={
        'nombre': 'Prod4',
        'codigo_barras': 'BAR-1',
        'precio_compra': 10.0,
        'precio_venta': 20.0,
    })
    assert response.status_code == 400
