from sqlalchemy.orm import Session

from app.models.client import Cliente
from app.services import audit_service


def create(db: Session, nombre: str, email: str | None = None, telefono: str | None = None, estado: str = 'activo') -> Cliente:
    cliente = Cliente(nombre=nombre, email=email, telefono=telefono, estado=estado)
    db.add(cliente)
    db.commit()
    db.refresh(cliente)

    audit_service.log(
        db,
        usuario_id=1,
        modulo='clientes',
        accion='crear',
        registro_id=cliente.id,
        descripcion=f'Cliente {cliente.nombre} creado',
        datos_nuevos={'id': cliente.id, 'nombre': cliente.nombre},
    )

    return cliente


def get(db: Session, cliente_id: int) -> Cliente | None:
    return db.get(Cliente, cliente_id)


def list(db: Session, estado: str | None = None, q: str | None = None) -> list[Cliente]:
    query = db.query(Cliente)
    if estado is None:
        query = query.filter(Cliente.estado == 'activo')
    else:
        query = query.filter(Cliente.estado == estado)

    if q:
        term = f"%{q.lower()}%"
        query = query.filter(
            (Cliente.nombre.ilike(term)) |
            (Cliente.email.ilike(term)) |
            (Cliente.telefono.ilike(term))
        )

    return query.all()


def update(db: Session, cliente_id: int, nombre: str | None = None, email: str | None = None, telefono: str | None = None, estado: str | None = None) -> Cliente | None:
    cliente = get(db, cliente_id)
    if cliente:
        datos_anteriores = {
            'nombre': cliente.nombre,
            'email': cliente.email,
            'telefono': cliente.telefono,
            'estado': cliente.estado,
        }

        if nombre is not None:
            cliente.nombre = nombre
        if email is not None:
            cliente.email = email
        if telefono is not None:
            cliente.telefono = telefono
        if estado is not None:
            cliente.estado = estado
        db.commit()
        db.refresh(cliente)

        audit_service.log(
            db,
            usuario_id=1,
            modulo='clientes',
            accion='editar',
            registro_id=cliente.id,
            descripcion=f'Cliente {cliente.nombre} actualizado',
            datos_anteriores=datos_anteriores,
            datos_nuevos={'id': cliente.id, 'nombre': cliente.nombre},
        )
    return cliente
