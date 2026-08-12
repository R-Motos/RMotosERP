from decimal import Decimal


def test_crear_recepcion_completa(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Recepcion'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Recepcion',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'completada',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 10, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 201
    data = response.json()
    assert data['estado'] == 'completada'
    assert len(data['detalles']) == 1


def test_crear_recepcion_parcial(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Parcial'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Parcial',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'pendiente',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 201
    data = response.json()
    assert data['estado'] == 'pendiente'
    
    orden_response = auth_client.get(f'/ordenes-compra/{orden_id}')
    assert orden_response.json()['estado'] == 'parcialmente_recibida'


def test_impedir_recibir_mas_que_orden(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Exceso'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Exceso',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'pendiente',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    
    response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'pendiente',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 6, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 400
    assert 'excede' in response.json()['message'].lower() or 'pendiente' in response.json()['message'].lower()


def test_impedir_producto_que_no_pertenece_a_la_orden(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Prod Fail'})
    auth_client.post('/productos/', json={
        'nombre': 'Prod Orden',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    auth_client.post('/productos/', json={
        'nombre': 'Prod Externo',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'pendiente',
        'detalles': [
            {'producto_id': 2, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 400
    assert 'no pertenece' in response.json()['message'].lower()


def test_crear_movimientos_inventario(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Mov'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Mov',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 0,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    recepcion = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'pendiente',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    recepcion_id = recepcion.json()['id']
    
    movimientos = auth_client.get('/movimientos/').json()
    assert len(movimientos) >= 1
    assert movimientos[0]['tipo'] == 'entrada'
    assert movimientos[0]['referencia'] == f'recepcion_compra_{recepcion_id}'


def test_actualizar_estado_orden(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Estado'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Estado',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'completada',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 10, 'precio_unitario': 100},
        ],
    })
    
    orden_response = auth_client.get(f'/ordenes-compra/{orden_id}')
    assert orden_response.json()['estado'] == 'completada'


def test_listar_recepciones(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor List'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod List',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    
    response = auth_client.get('/recepciones-compra/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_obtener_recepcion(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Get'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Get',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    create_response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    recepcion_id = create_response.json()['id']
    
    response = auth_client.get(f'/recepciones-compra/{recepcion_id}')
    assert response.status_code == 200
    assert response.json()['id'] == recepcion_id


def test_orden_inexistente(auth_client):
    response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': 999,
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 400
    assert 'orden' in response.json()['message'].lower()


def test_producto_inexistente(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Prod Inex'})
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 1, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': 999, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    assert response.status_code == 400
    assert 'producto' in response.json()['message'].lower()


def test_recepcion_inmutable(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Inmutable'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Inmutable',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']
    
    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 10, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']
    
    create_response = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'pendiente',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    recepcion_id = create_response.json()['id']
    
    response = auth_client.put(f'/recepciones-compra/{recepcion_id}', json={'observaciones': 'No debe pasar'})
    assert response.status_code == 405
    
    response = auth_client.delete(f'/recepciones-compra/{recepcion_id}')
    assert response.status_code == 405
