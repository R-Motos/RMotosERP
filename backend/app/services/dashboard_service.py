from decimal import Decimal
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.product import Producto
from app.models.sale import Venta, VentaDetalle
from app.models.client import Cliente
from app.models.financial_movement import MovimientoFinanciero


def _movements_query(db: Session):
    return db.query(MovimientoFinanciero).outerjoin(
        Venta,
        (MovimientoFinanciero.origen == 'venta') &
        (MovimientoFinanciero.referencia_id == Venta.id),
    ).filter(
        (MovimientoFinanciero.origen != 'venta') |
        (Venta.estado != 'anulada')
    )


def get_resumen(db: Session) -> dict:
    ventas_completadas = db.query(Venta).filter(Venta.estado == 'completada')
    cantidad_ventas = ventas_completadas.count()
    total_vendido = ventas_completadas.with_entities(func.coalesce(func.sum(Venta.total), Decimal('0'))).scalar() or Decimal('0')
    promedio_venta = (total_vendido / cantidad_ventas) if cantidad_ventas > 0 else Decimal('0')

    productos = db.query(Producto)
    cantidad_productos = productos.count()
    productos_bajo_stock = db.query(Producto).filter(Producto.cantidad_disponible < Producto.stock_minimo).count()
    valor_inventario = db.query(func.coalesce(func.sum(Producto.precio_compra * Producto.cantidad_disponible), Decimal('0'))).scalar() or Decimal('0')

    clientes = db.query(Cliente)
    cantidad_clientes = clientes.count()
    clientes_con_compras = db.query(Cliente).filter(Cliente.cantidad_compras > 0).count()

    ingresos = _movements_query(db).with_entities(func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0'))).filter(MovimientoFinanciero.tipo == 'ingreso').scalar() or Decimal('0')
    egresos = _movements_query(db).with_entities(func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0'))).filter(MovimientoFinanciero.tipo == 'egreso').scalar() or Decimal('0')

    balance = ingresos - egresos - valor_inventario

    profit_esperado = db.query(func.coalesce(func.sum((Producto.precio_venta - Producto.precio_compra) * Producto.cantidad_disponible), Decimal('0'))).filter(Producto.cantidad_disponible > 0).scalar() or Decimal('0')

    return {
        'ventas': {
            'cantidad_ventas': cantidad_ventas,
            'total_vendido': int(total_vendido),
            'promedio_venta': int(promedio_venta),
        },
        'inventario': {
            'cantidad_productos': cantidad_productos,
            'productos_bajo_stock': productos_bajo_stock,
            'valor_inventario': int(valor_inventario),
        },
        'clientes': {
            'cantidad_clientes': cantidad_clientes,
            'clientes_con_compras': clientes_con_compras,
        },
        'finanzas': {
            'ingresos_totales': int(ingresos),
            'egresos_totales': int(egresos),
            'balance': int(balance),
            'profit_esperado': int(profit_esperado),
        },
    }


def get_ventas_por_dia(db: Session, fecha_inicio: datetime | None = None, fecha_fin: datetime | None = None) -> dict:
    query = db.query(Venta).filter(Venta.estado == 'completada')

    if fecha_inicio:
        query = query.filter(Venta.fecha_venta >= fecha_inicio)
    if fecha_fin:
        query = query.filter(Venta.fecha_venta <= fecha_fin)

    resultados = query.with_entities(
        func.date(Venta.fecha_venta).label('fecha'),
        func.coalesce(func.sum(Venta.total), Decimal('0')).label('total_vendido'),
        func.count(Venta.id).label('cantidad_ventas'),
    ).group_by(func.date(Venta.fecha_venta)).order_by(func.date(Venta.fecha_venta).desc()).all()

    items = [
        {
            'fecha': r.fecha,
            'total_vendido': r.total_vendido,
            'cantidad_ventas': r.cantidad_ventas,
        }
        for r in resultados
    ]

    return {
        'items': items,
        'total': len(items),
    }


def get_productos(db: Session) -> dict:
    mas_vendidos = db.query(
        Producto.id,
        Producto.nombre,
        func.coalesce(func.sum(VentaDetalle.cantidad), Decimal('0')).label('total_vendido'),
    ).join(VentaDetalle, Producto.id == VentaDetalle.producto_id).join(Venta, VentaDetalle.venta_id == Venta.id).filter(
        Venta.estado == 'completada'
    ).group_by(Producto.id, Producto.nombre).order_by(func.sum(VentaDetalle.cantidad).desc()).limit(10).all()

    productos_vendidos = db.query(VentaDetalle.producto_id).join(Venta).filter(Venta.estado == 'completada').distinct().subquery()
    sin_movimiento = db.query(Producto.id, Producto.nombre).filter(
        ~Producto.id.in_(db.query(productos_vendidos.c.producto_id))
    ).all()

    bajo_stock = db.query(Producto).filter(Producto.cantidad_disponible < Producto.stock_minimo).all()

    return {
        'mas_vendidos': [
            {'id': r.id, 'nombre': r.nombre, 'total_vendido': r.total_vendido}
            for r in mas_vendidos
        ],
        'sin_movimiento': [
            {'id': r.id, 'nombre': r.nombre}
            for r in sin_movimiento
        ],
        'bajo_stock': [
            {
                'id': r.id,
                'nombre': r.nombre,
                'cantidad_disponible': r.cantidad_disponible,
                'stock_minimo': r.stock_minimo,
            }
            for r in bajo_stock
        ],
    }


def get_finanzas(db: Session) -> dict:
    ingresos = _movements_query(db).with_entities(func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0'))).filter(MovimientoFinanciero.tipo == 'ingreso').scalar() or Decimal('0')
    egresos = _movements_query(db).with_entities(func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0'))).filter(MovimientoFinanciero.tipo == 'egreso').scalar() or Decimal('0')

    valor_inventario = db.query(func.coalesce(func.sum(Producto.precio_compra * Producto.cantidad_disponible), Decimal('0'))).scalar() or Decimal('0')

    balance = ingresos - egresos - valor_inventario

    profit_esperado = db.query(func.coalesce(func.sum((Producto.precio_venta - Producto.precio_compra) * Producto.cantidad_disponible), Decimal('0'))).filter(Producto.cantidad_disponible > 0).scalar() or Decimal('0')

    por_tipo = _movements_query(db).with_entities(
        MovimientoFinanciero.tipo,
        func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0')).label('total'),
        func.count(MovimientoFinanciero.id).label('cantidad'),
    ).group_by(MovimientoFinanciero.tipo).all()

    return {
        'ingresos_totales': int(ingresos),
        'egresos_totales': int(egresos),
        'balance': int(balance),
        'profit_esperado': int(profit_esperado),
        'valor_inventario': int(valor_inventario),
        'por_tipo': [
            {'tipo': r.tipo, 'total': int(r.total), 'cantidad': r.cantidad}
            for r in por_tipo
        ],
    }
