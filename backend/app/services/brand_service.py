from sqlalchemy.orm import Session

from app.models.brand import Marca


def create(db: Session, nombre: str) -> Marca:
    marca = Marca(nombre=nombre)
    db.add(marca)
    db.commit()
    db.refresh(marca)
    return marca


def get(db: Session, marca_id: int) -> Marca | None:
    return db.get(Marca, marca_id)


def list(db: Session) -> list[Marca]:
    return db.query(Marca).all()


def update(db: Session, marca_id: int, nombre: str) -> Marca | None:
    marca = get(db, marca_id)
    if marca:
        marca.nombre = nombre
        db.commit()
        db.refresh(marca)
    return marca


def delete(db: Session, marca_id: int) -> bool:
    marca = get(db, marca_id)
    if marca:
        db.delete(marca)
        db.commit()
        return True
    return False
