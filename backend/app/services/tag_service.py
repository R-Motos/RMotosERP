from sqlalchemy.orm import Session

from app.models.tag import Etiqueta


def create(db: Session, nombre: str) -> Etiqueta:
    etiqueta = Etiqueta(nombre=nombre)
    db.add(etiqueta)
    db.commit()
    db.refresh(etiqueta)
    return etiqueta


def get(db: Session, etiqueta_id: int) -> Etiqueta | None:
    return db.get(Etiqueta, etiqueta_id)


def list(db: Session) -> list[Etiqueta]:
    return db.query(Etiqueta).all()


def update(db: Session, etiqueta_id: int, nombre: str) -> Etiqueta | None:
    etiqueta = get(db, etiqueta_id)
    if etiqueta:
        etiqueta.nombre = nombre
        db.commit()
        db.refresh(etiqueta)
    return etiqueta


def delete(db: Session, etiqueta_id: int) -> bool:
    etiqueta = get(db, etiqueta_id)
    if etiqueta:
        db.delete(etiqueta)
        db.commit()
        return True
    return False
