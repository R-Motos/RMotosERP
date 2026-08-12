def test_create_marca(auth_client):
    response = auth_client.post('/marcas/', json={'nombre': 'Yamaha'})
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Yamaha'
    assert 'id' in data


def test_list_marcas(auth_client):
    response = auth_client.get('/marcas/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_marca(auth_client):
    create_response = auth_client.post('/marcas/', json={'nombre': 'Honda'})
    marca_id = create_response.json()['id']
    response = auth_client.get(f'/marcas/{marca_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Honda'


def test_get_marca_not_found(auth_client):
    response = auth_client.get('/marcas/999')
    assert response.status_code == 404


def test_update_marca(auth_client):
    create_response = auth_client.post('/marcas/', json={'nombre': 'Original'})
    marca_id = create_response.json()['id']
    response = auth_client.put(f'/marcas/{marca_id}', json={'nombre': 'Actualizada'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizada'


def test_delete_marca(auth_client):
    create_response = auth_client.post('/marcas/', json={'nombre': 'Borrar'})
    marca_id = create_response.json()['id']
    response = auth_client.delete(f'/marcas/{marca_id}')
    assert response.status_code == 204
    get_response = auth_client.get(f'/marcas/{marca_id}')
    assert get_response.status_code == 404
