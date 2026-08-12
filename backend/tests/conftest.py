import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.main import app as fastapi_app
from app.db.session import get_db
from app.models.role import Role
from app.models.permission import Permission
from app.models import rol_permisos
from app.services import user_service, auth_service
import app.models  # noqa: F401 - ensure models are registered


@pytest.fixture(scope='session')
def engine():
    return create_engine(
        'sqlite:///:memory:',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )


@pytest.fixture(scope='session')
def tables(engine):
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        session.add_all([
            Role(nombre='administrador', descripcion='Administrador del sistema', estado='activo', es_fijo=True),
            Role(nombre='gestor', descripcion='Gestor de operaciones', estado='activo', es_fijo=True),
            Role(nombre='vendedor', descripcion='Vendedor del POS', estado='activo', es_fijo=True),
        ])
        session.commit()
    finally:
        session.close()
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture(scope='session')
def permissions(engine, tables):
    """Create permissions for all modules and assign to admin role."""
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        modules = [
            'productos', 'categorias', 'marcas', 'etiquetas', 'clientes',
            'usuarios', 'proveedores', 'ordenes_compra', 'recepciones_compra', 'cupones', 'pos',
            'ventas', 'movimientos', 'finanzas', 'configuracion', 'devoluciones', 'garantias'
        ]
        actions = ['ver', 'listar', 'crear', 'editar', 'eliminar']
        
        # Create all permissions
        perms = []
        for modulo in modules:
            for accion in actions:
                perms.append(Permission(modulo=modulo, accion=accion, descripcion=f'{accion.capitalize()} {modulo}'))
        
        session.add_all(perms)
        session.flush()
        
        # Assign all permissions to administrador role
        admin_role = session.query(Role).filter(Role.nombre == 'administrador').first()
        for perm in perms:
            session.execute(rol_permisos.insert().values(rol_id=admin_role.id, permiso_id=perm.id))
        
        session.commit()
        yield perms
    finally:
        session.close()


@pytest.fixture
def db_session(engine, tables):
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture
def client(db_session: Session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    fastapi_app.dependency_overrides[get_db] = override_get_db
    yield TestClient(fastapi_app)
    fastapi_app.dependency_overrides.clear()


@pytest.fixture
def admin_user(db_session: Session, permissions):
    """Create an admin user with PIN 1234."""
    unique_id = str(uuid.uuid4())[:8]
    user = user_service.create(db_session, nombre='Admin Test', username=f'admin_test_{unique_id}', pin='1234', rol_ids=[1])
    db_session.commit()
    return user


@pytest.fixture
def admin_token(admin_user):
    """Generate JWT token for admin user."""
    return auth_service.create_access_token(admin_user.id)


@pytest.fixture
def auth_client(client: TestClient, admin_token: str):
    """TestClient with Authorization header set."""
    client.headers.update({'Authorization': f'Bearer {admin_token}'})
    return client
