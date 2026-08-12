from decimal import Decimal
from sqlalchemy.orm import Session

from app.models.inventory_movement import MovimientoInventario, MovimientoTipo
from app.models.product import Producto
from app.models.user import User


TIPOS_PERMITIDOS = {'entrada', 'salida', 'ajuste'}


def create(db: Session, producto_id: int, tipo: str, cantidad: Decimal, usuario_id: int, observaciones: str | None = None, referencia: str | None = None) -> MovimientoInventario:
    if tipo not in TIPOS_PERMITIDOS:
        raise ValueError('Tipo de movimiento no permitido')

    producto = db.get(Producto, producto_id)
    if not producto:
        raise ValueError('Producto no encontrado')

    usuario = db.get(User, usuario_id)
    if not usuario:
        raise ValueError('Usuario no encontrado')

    if tipo == 'entrada':
        if cantidad <= 0:
            raise ValueError('La cantidad para entrada debe ser mayor a 0')
        nuevo_stock = producto.cantidad_disponible + cantidad
    elif tipo == 'salida':
        if cantidad <= 0:
            raise ValueError('La cantidad para salida debe ser mayor a 0')
        nuevo_stock = producto.cantidad_disponible - cantidad
    else:
        if cantidad == 0:
            raise ValueError('La cantidad para ajuste no puede ser 0')
        nuevo_stock = producto.cantidad_disponible + cantidad

    if nuevo_stock < 0:
        raise ValueError('Inventario negativo no permitido')

    producto.cantidad_disponible = nuevo_stock

    movimiento = MovimientoInventario(
        producto_id=producto_id,
        tipo=tipo,
        cantidad=cantidad,
        observaciones=observaciones,
        usuario_id=usuario_id,
        referencia=referencia,
    )
    db.add(movimiento)
    db.commit()
    db.refresh(movimiento)
    return movimiento


def get(db: Session, movimiento_id: int) -> MovimientoInventario | None:
    return db.get(MovimientoInventario, movimiento_id)


def list(db: Session) -> list[MovimientoInventario]:
    return db.query(MovimientoInventario).order_by(MovimientoInventario.created_at.desc()).all()
