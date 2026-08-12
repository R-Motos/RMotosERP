from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.coupon import Cupon
from app.services import audit_service


def create(db: Session, codigo: str, tipo: str, valor: float, fecha_inicio, fecha_fin, uso_maximo: int, estado: str = 'activo') -> Cupon:
    cupon = Cupon(
        codigo=codigo,
        tipo=tipo,
        valor=int(valor),
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        uso_maximo=uso_maximo,
        estado=estado,
    )
    db.add(cupon)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError('Ya existe un cupón con este código')
    db.refresh(cupon)

    audit_service.log(
        db,
        usuario_id=1,
        modulo='cupones',
        accion='crear',
        registro_id=cupon.id,
        descripcion=f'Cupón {cupon.codigo} creado',
        datos_nuevos={'id': cupon.id, 'codigo': cupon.codigo},
    )

    return cupon


def get(db: Session, cupon_id: int) -> Cupon | None:
    return db.get(Cupon, cupon_id)


def list(db: Session, estado: str | None = None, q: str | None = None) -> list[Cupon]:
    query = db.query(Cupon)
    if estado:
        query = query.filter(Cupon.estado == estado)

    if q:
        term = f"%{q.lower()}%"
        query = query.filter(Cupon.codigo.ilike(term))

    return query.order_by(Cupon.created_at.desc()).all()


def update(db: Session, cupon_id: int, **kwargs) -> Cupon | None:
    cupon = get(db, cupon_id)
    if cupon:
        datos_anteriores = {
            'codigo': cupon.codigo,
            'tipo': cupon.tipo,
            'valor': str(cupon.valor),
            'fecha_inicio': cupon.fecha_inicio.isoformat(),
            'fecha_fin': cupon.fecha_fin.isoformat(),
            'uso_maximo': cupon.uso_maximo,
            'estado': cupon.estado,
        }

        for key, value in kwargs.items():
            if hasattr(cupon, key):
                setattr(cupon, key, int(value) if key == 'valor' and value is not None else value)

        db.commit()
        db.refresh(cupon)

        audit_service.log(
            db,
            usuario_id=1,
            modulo='cupones',
            accion='editar',
            registro_id=cupon.id,
            descripcion=f'Cupón {cupon.codigo} actualizado',
            datos_anteriores=datos_anteriores,
            datos_nuevos={'id': cupon.id, 'codigo': cupon.codigo},
        )
    return cupon


def change_state(db: Session, cupon_id: int, estado: str) -> Cupon | None:
    return update(db, cupon_id, estado=estado)


def delete(db: Session, cupon_id: int) -> Cupon | None:
    cupon = get(db, cupon_id)
    if cupon:
        audit_service.log(
            db,
            usuario_id=1,
            modulo='cupones',
            accion='eliminar',
            registro_id=cupon.id,
            descripcion=f'Cupón {cupon.codigo} eliminado',
            datos_anteriores={'id': cupon.id, 'codigo': cupon.codigo},
        )
        db.delete(cupon)
        db.commit()
    return cupon
