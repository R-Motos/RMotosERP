def test_create_proveedor(auth_client):
    response = auth_client.post('/proveedores/', json={
        'nombre': 'Proveedor Test',
        'nit': '123456789',
        'telefono': '3001234567',
    })
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Proveedor Test'
    assert data['estado'] == 'activo'
    assert 'id' in data


def test_list_proveedores_default_solo_activos(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Inactivo', 'estado': 'inactivo'})
    response = auth_client.get('/proveedores/')
    assert response.status_code == 200
    data = response.json()
    nombres = [p['nombre'] for p in data]
    assert 'Inactivo' not in nombres


def test_list_proveedores_filtro_inactivo(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Inactivo', 'estado': 'inactivo'})
    response = auth_client.get('/proveedores/?estado=inactivo')
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]['nombre'] == 'Inactivo'


def test_get_proveedor(auth_client):
    create_response = auth_client.post('/proveedores/', json={
        'nombre': 'Proveedor Get Unico',
        'nit': '987654321',
    })
    proveedor_id = create_response.json()['id']
    response = auth_client.get(f'/proveedores/{proveedor_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Proveedor Get Unico'


def test_get_proveedor_not_found(auth_client):
    response = auth_client.get('/proveedores/999')
    assert response.status_code == 404


def test_update_proveedor_nombre(auth_client):
    create_response = auth_client.post('/proveedores/', json={
        'nombre': 'Original',
        'nit': '111111111',
    })
    proveedor_id = create_response.json()['id']
    response = auth_client.put(f'/proveedores/{proveedor_id}', json={'nombre': 'Actualizado'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizado'


def test_update_proveedor_estado(auth_client):
    create_response = auth_client.post('/proveedores/', json={
        'nombre': 'Proveedor Estado Unico',
        'estado': 'activo',
    })
    proveedor_id = create_response.json()['id']
    response = auth_client.put(f'/proveedores/{proveedor_id}', json={'estado': 'inactivo'})
    assert response.status_code == 200
    assert response.json()['estado'] == 'inactivo'


def test_create_proveedor_nombre_duplicado(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Duplicado'})
    response = auth_client.post('/proveedores/', json={'nombre': 'Duplicado'})
    assert response.status_code == 400


def test_create_proveedor_nit_duplicado(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Uno', 'nit': '123456'})
    response = auth_client.post('/proveedores/', json={'nombre': 'Dos', 'nit': '123456'})
    assert response.status_code == 400
