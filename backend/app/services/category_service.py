from sqlalchemy.orm import Session

from app.models.category import Categoria


def create(db: Session, nombre: str) -> Categoria:
    categoria = Categoria(nombre=nombre)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


def get(db: Session, categoria_id: int) -> Categoria | None:
    return db.get(Categoria, categoria_id)


def list(db: Session) -> list[Categoria]:
    return db.query(Categoria).all()


def update(db: Session, categoria_id: int, nombre: str) -> Categoria | None:
    categoria = get(db, categoria_id)
    if categoria:
        categoria.nombre = nombre
        db.commit()
        db.refresh(categoria)
    return categoria


def delete(db: Session, categoria_id: int) -> bool:
    categoria = get(db, categoria_id)
    if categoria:
        db.delete(categoria)
        db.commit()
        return True
    return False
