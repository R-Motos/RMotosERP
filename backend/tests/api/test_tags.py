def test_create_etiqueta(auth_client):
    response = auth_client.post('/etiquetas/', json={'nombre': 'Compatibilidad'})
    assert response.status_code == 201
    data = response.json()
    assert data['nombre'] == 'Compatibilidad'
    assert 'id' in data


def test_list_etiquetas(auth_client):
    response = auth_client.get('/etiquetas/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_etiqueta(auth_client):
    create_response = auth_client.post('/etiquetas/', json={'nombre': 'Repuesto'})
    etiqueta_id = create_response.json()['id']
    response = auth_client.get(f'/etiquetas/{etiqueta_id}')
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Repuesto'


def test_get_etiqueta_not_found(auth_client):
    response = auth_client.get('/etiquetas/999')
    assert response.status_code == 404


def test_update_etiqueta(auth_client):
    create_response = auth_client.post('/etiquetas/', json={'nombre': 'Original'})
    etiqueta_id = create_response.json()['id']
    response = auth_client.put(f'/etiquetas/{etiqueta_id}', json={'nombre': 'Actualizada'})
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Actualizada'


def test_delete_etiqueta(auth_client):
    create_response = auth_client.post('/etiquetas/', json={'nombre': 'Borrar'})
    etiqueta_id = create_response.json()['id']
    response = auth_client.delete(f'/etiquetas/{etiqueta_id}')
    assert response.status_code == 204
    get_response = auth_client.get(f'/etiquetas/{etiqueta_id}')
    assert get_response.status_code == 404
