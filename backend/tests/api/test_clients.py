def test_create_cliente(auth_client):
    response = auth_client.post('/clientes/', json={
        'nombre': 'Juan Perez',
        'email': 'juan@example.com',
        'telefono': '3001234567',
    })
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Juan Perez'
    assert data['estado'] == 'activo'
    assert 'id' in data


def test_list_clientes_default_solo_activos(auth_client):
    auth_client.post('/clientes/', json={'nombre': 'Inactivo', 'estado': 'inactivo'})
    response = auth_client.get('/clientes/')
    assert response.status_code == 200
    data = response.json()
    nombres = [c['nombre'] for c in data]
    assert 'Inactivo' not in nombres


def test_list_clientes_filtro_inactivo(auth_client):
    auth_client.post('/clientes/', json={'nombre': 'Inactivo', 'estado': 'inactivo'})
    response = auth_client.get('/clientes/?estado=inactivo')
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]['nombre'] == 'Inactivo'


def test_get_cliente(auth_client):
    create_response = auth_client.post('/clientes/', json={
        'nombre': 'Maria Garcia',
        'email': 'maria@example.com',
        'telefono': '3009876543',
    })
    cliente_id = create_response.json()['id']
    response = auth_client.get(f'/clientes/{cliente_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Maria Garcia'


def test_get_cliente_not_found(auth_client):
    response = auth_client.get('/clientes/999')
    assert response.status_code == 404


def test_update_cliente_nombre(auth_client):
    create_response = auth_client.post('/clientes/', json={
        'nombre': 'Original',
        'email': 'original@example.com',
        'telefono': '3000000000',
    })
    cliente_id = create_response.json()['id']
    response = auth_client.put(f'/clientes/{cliente_id}', json={'nombre': 'Actualizado'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizado'


def test_update_cliente_estado(auth_client):
    create_response = auth_client.post('/clientes/', json={
        'nombre': 'Cliente Estado',
        'estado': 'activo',
    })
    cliente_id = create_response.json()['id']
    response = auth_client.put(f'/clientes/{cliente_id}', json={'estado': 'inactivo'})
    assert response.status_code == 200
    assert response.json()['estado'] == 'inactivo'
