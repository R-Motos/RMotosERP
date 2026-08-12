from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.supplier import Proveedor


def create(db: Session, nombre: str, nit: str | None = None, contacto: str | None = None, telefono: str | None = None, email: str | None = None, direccion: str | None = None, ciudad: str | None = None, observaciones: str | None = None, estado: str = 'activo') -> Proveedor:
    existing = db.query(Proveedor).filter(Proveedor.nombre == nombre).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Nombre de proveedor duplicado')

    if nit:
        existing_nit = db.query(Proveedor).filter(Proveedor.nit == nit).first()
        if existing_nit:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='NIT duplicado')

    proveedor = Proveedor(
        nombre=nombre,
        nit=nit,
        contacto=contacto,
        telefono=telefono,
        email=email,
        direccion=direccion,
        ciudad=ciudad,
        observaciones=observaciones,
        estado=estado,
    )
    db.add(proveedor)
    db.commit()
    db.refresh(proveedor)
    return proveedor


def get(db: Session, proveedor_id: int) -> Proveedor | None:
    return db.get(Proveedor, proveedor_id)


def list(db: Session, estado: str | None = None, q: str | None = None) -> list[Proveedor]:
    query = db.query(Proveedor)
    if estado is None:
        query = query.filter(Proveedor.estado == 'activo')
    else:
        query = query.filter(Proveedor.estado == estado)

    if q:
        term = f"%{q.lower()}%"
        query = query.filter(
            (Proveedor.nombre.ilike(term)) |
            (Proveedor.nit.ilike(term)) |
            (Proveedor.email.ilike(term)) |
            (Proveedor.telefono.ilike(term))
        )

    return query.all()


def update(db: Session, proveedor_id: int, nombre: str | None = None, nit: str | None = None, contacto: str | None = None, telefono: str | None = None, email: str | None = None, direccion: str | None = None, ciudad: str | None = None, observaciones: str | None = None, estado: str | None = None) -> Proveedor | None:
    proveedor = get(db, proveedor_id)
    if proveedor:
        if nombre is not None and nombre != proveedor.nombre:
            existing = db.query(Proveedor).filter(Proveedor.nombre == nombre).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Nombre de proveedor duplicado')
            proveedor.nombre = nombre

        if nit is not None and nit != proveedor.nit:
            existing_nit = db.query(Proveedor).filter(Proveedor.nit == nit).first()
            if existing_nit:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='NIT duplicado')
            proveedor.nit = nit

        if contacto is not None:
            proveedor.contacto = contacto
        if telefono is not None:
            proveedor.telefono = telefono
        if email is not None:
            proveedor.email = email
        if direccion is not None:
            proveedor.direccion = direccion
        if ciudad is not None:
            proveedor.ciudad = ciudad
        if observaciones is not None:
            proveedor.observaciones = observaciones
        if estado is not None:
            proveedor.estado = estado
        db.commit()
        db.refresh(proveedor)
    return proveedor
