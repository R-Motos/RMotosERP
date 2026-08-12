def test_create_categoria(auth_client):
    response = auth_client.post('/categorias/', json={'nombre': 'Frenos'})
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Frenos'
    assert 'id' in data


def test_list_categorias(auth_client):
    response = auth_client.get('/categorias/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_categoria(auth_client):
    create_response = auth_client.post('/categorias/', json={'nombre': 'Aceites'})
    categoria_id = create_response.json()['id']
    response = auth_client.get(f'/categorias/{categoria_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Aceites'


def test_get_categoria_not_found(auth_client):
    response = auth_client.get('/categorias/999')
    assert response.status_code == 404


def test_update_categoria(auth_client):
    create_response = auth_client.post('/categorias/', json={'nombre': 'Original'})
    categoria_id = create_response.json()['id']
    response = auth_client.put(f'/categorias/{categoria_id}', json={'nombre': 'Actualizada'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizada'


def test_delete_categoria(auth_client):
    create_response = auth_client.post('/categorias/', json={'nombre': 'Borrar'})
    categoria_id = create_response.json()['id']
    response = auth_client.delete(f'/categorias/{categoria_id}')
    assert response.status_code == 204
    get_response = auth_client.get(f'/categorias/{categoria_id}')
    assert get_response.status_code == 404
