from decimal import Decimal


def test_crear_ingreso_manual(auth_client):
    response = auth_client.post('/movimientos-financieros/', json={
        'tipo': 'ingreso',
        'concepto': 'Pago cliente',
        'descripcion': 'Abono factura 001',
        'monto': 1500,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['tipo'] == 'ingreso'
    assert data['origen'] == 'manual'
    assert Decimal(data['monto']) == Decimal('1500')


def test_crear_egreso_manual(auth_client):
    response = auth_client.post('/movimientos-financieros/', json={
        'tipo': 'egreso',
        'concepto': 'Pago servicios',
        'descripcion': 'Luz y agua',
        'monto': 300,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['tipo'] == 'egreso'
    assert data['origen'] == 'manual'
    assert Decimal(data['monto']) == Decimal('300')


def test_validacion_monto_negativo(auth_client):
    response = auth_client.post('/movimientos-financieros/', json={
        'tipo': 'ingreso',
        'concepto': 'Pago',
        'monto': -100,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })
    assert response.status_code == 400
    assert 'monto' in response.json()['message'].lower()


def test_listar_movimientos(auth_client):
    auth_client.post('/movimientos-financieros/', json={
        'tipo': 'ingreso',
        'concepto': 'Pago 1',
        'monto': 500,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })
    auth_client.post('/movimientos-financieros/', json={
        'tipo': 'egreso',
        'concepto': 'Gasto 1',
        'monto': 200,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })

    response = auth_client.get('/movimientos-financieros/')
    assert response.status_code == 200
    data = response.json()
    assert 'items' in data
    assert data['total'] >= 2
    assert len(data['items']) >= 2


def test_calculo_balance(auth_client, db_session):
    from app.models.financial_movement import MovimientoFinanciero
    db_session.query(MovimientoFinanciero).delete()
    db_session.commit()

    auth_client.post('/movimientos-financieros/', json={
        'tipo': 'ingreso',
        'concepto': 'Pago balance',
        'monto': 1000,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })
    auth_client.post('/movimientos-financieros/', json={
        'tipo': 'egreso',
        'concepto': 'Gasto balance',
        'monto': 400,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })

    response = auth_client.get('/movimientos-financieros/balance')
    assert response.status_code == 200
    data = response.json()
    assert Decimal(data['total_ingresos']) == Decimal('1000')
    assert Decimal(data['total_egresos']) == Decimal('400')
    assert Decimal(data['balance']) == Decimal('600')


def test_integracion_venta_genera_ingreso(auth_client):
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Finanzas Venta',
        'precio_compra': 10,
        'precio_venta': 20,
        'cantidad_disponible': 10,
    })
    producto_id = producto.json()['id']

    venta = auth_client.post('/ventas/', json={
        'usuario_id': 1,
        'metodo_pago': 'efectivo',
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 2, 'precio_unitario': 20},
        ],
    })
    assert venta.status_code == 201
    venta = venta.json()

    movimientos = auth_client.get('/movimientos-financieros/').json()
    assert movimientos['total'] >= 1
    mov = movimientos['items'][0]
    assert mov['tipo'] == 'ingreso'
    assert mov['origen'] == 'venta'
    assert mov['referencia_id'] == venta['id']
    assert Decimal(mov['monto']) == Decimal(venta['total'])


def test_integracion_compra_genera_egreso(auth_client):
    auth_client.post('/proveedores/', json={'nombre': 'Proveedor Finanzas'})
    producto = auth_client.post('/productos/', json={
        'nombre': 'Prod Finanzas Compra',
        'precio_compra': 10,
        'precio_venta': 20,
    })
    producto_id = producto.json()['id']

    orden = auth_client.post('/ordenes-compra/', json={
        'proveedor_id': 1,
        'usuario_id': 1,
        'detalles': [
            {'producto_id': producto_id, 'cantidad': 5, 'precio_unitario': 100},
        ],
    })
    orden_id = orden.json()['id']

    recepcion = auth_client.post('/recepciones-compra/', json={
        'orden_compra_id': orden_id,
        'proveedor_id': 1,
        'usuario_id': 1,
        'estado': 'completada',
        'detalles': [
            {'producto_id': producto_id, 'cantidad_recibida': 5, 'precio_unitario': 100},
        ],
    })
    assert recepcion.status_code == 201
    recepcion = recepcion.json()

    movimientos = auth_client.get('/movimientos-financieros/').json()
    assert movimientos['total'] >= 1
    mov = movimientos['items'][0]
    assert mov['tipo'] == 'egreso'
    assert mov['origen'] == 'compra'
    assert mov['referencia_id'] == recepcion['id']
    assert Decimal(mov['monto']) == Decimal('500')


def test_obtener_movimiento_financiero(auth_client):
    create_response = auth_client.post('/movimientos-financieros/', json={
        'tipo': 'ingreso',
        'concepto': 'Pago get',
        'monto': 100,
        'fecha': '2026-07-23T10:00:00',
        'usuario_id': 1,
    })
    movimiento_id = create_response.json()['id']

    response = auth_client.get(f'/movimientos-financieros/{movimiento_id}')
    assert response.status_code == 200
    assert response.json()['id'] == movimiento_id
