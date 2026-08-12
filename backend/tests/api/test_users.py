def test_create_user(auth_client):
    response = auth_client.post('/api/usuarios', json={
        'nombre': 'Admin',
        'username': 'admin',
        'email': 'admin@rmotos.com',
        'telefono': '3000000000',
        'pin': '1234',
        'rol_ids': [1],
    })
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Admin'
    assert data['username'] == 'admin'
    assert data['estado'] == 'activo'
    assert len(data['roles']) == 1
    assert data['roles'][0]['nombre'] == 'administrador'
    assert 'id' in data


def test_list_users_default(auth_client):
    auth_client.post('/api/usuarios', json={'nombre': 'Inactivo', 'username': 'inactivo', 'estado': 'inactivo', 'rol_ids': [1]})
    response = auth_client.get('/api/usuarios')
    assert response.status_code == 200
    data = response.json()
    nombres = [u['nombre'] for u in data]
    assert 'Inactivo' not in nombres


def test_list_users_filtro_inactivo(auth_client):
    auth_client.post('/api/usuarios', json={'nombre': 'Inactivo', 'username': 'inactivo2', 'estado': 'inactivo', 'rol_ids': [1]})
    response = auth_client.get('/api/usuarios?estado=inactivo')
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]['nombre'] == 'Inactivo'


def test_get_user(auth_client):
    create_response = auth_client.post('/api/usuarios', json={
        'nombre': 'Vendedor',
        'username': 'vendedor',
        'email': 'vendedor@rmotos.com',
        'telefono': '3001111111',
        'pin': '0000',
        'rol_ids': [3],
    })
    user_id = create_response.json()['id']
    response = auth_client.get(f'/api/usuarios/{user_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Vendedor'
    assert response.json()['username'] == 'vendedor'
    assert len(response.json()['roles']) == 1
    assert response.json()['roles'][0]['nombre'] == 'vendedor'


def test_get_user_not_found(auth_client):
    response = auth_client.get('/api/usuarios/999')
    assert response.status_code == 404


def test_update_user_nombre(auth_client):
    create_response = auth_client.post('/api/usuarios', json={
        'nombre': 'Original',
        'username': 'original',
        'email': 'original@rmotos.com',
        'telefono': '3002222222',
        'pin': '1111',
        'rol_ids': [2],
    })
    user_id = create_response.json()['id']
    response = auth_client.put(f'/api/usuarios/{user_id}', json={'nombre': 'Actualizado'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizado'


def test_update_user_estado(auth_client):
    create_response = auth_client.post('/api/usuarios', json={
        'nombre': 'Cambio Estado',
        'username': 'cambio_estado',
        'rol_ids': [1],
    })
    user_id = create_response.json()['id']
    response = auth_client.put(f'/api/usuarios/{user_id}', json={'estado': 'inactivo'})
    assert response.status_code == 200
    assert response.json()['estado'] == 'inactivo'


def test_update_user_roles(auth_client):
    create_response = auth_client.post('/api/usuarios', json={'nombre': 'Cambio Roles', 'username': 'cambio_roles', 'rol_ids': [1]})
    user_id = create_response.json()['id']
    response = auth_client.put(f'/api/usuarios/{user_id}', json={'rol_ids': [2, 3]})
    assert response.status_code == 200
    roles = response.json()['roles']
    assert len(roles) == 2
    role_nombres = {r['nombre'] for r in roles}
    assert role_nombres == {'gestor', 'vendedor'}
