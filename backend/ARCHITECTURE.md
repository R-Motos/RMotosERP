# Arquitectura del Backend - RMotos ERP

## 1. Estructura del backend

### routers/
Responsabilidad: recibir la petición HTTP, validar entrada con schemas, ejecutar el service correspondiente y retornar la respuesta. No contienen lógica de negocio.

### services/
Responsabilidad: implementar la lógica de negocio. Un método por caso de uso. Manipulan la sesión de base de datos directamente. No hay capa repository.

### schemas/
Responsabilidad: definir contratos de entrada y salida con Pydantic. Validación de requests y serialización de responses.

### models/
Responsabilidad: definir el esquema de base de datos con SQLAlchemy 2.0. Contienen únicamente ORM y constraints. Sin lógica de negocio.

### db/
Responsabilidad: configuración de engine, sesión y base declarativa. Contiene:
- base.py: DeclarativeBase y campos comunes
- session.py: engine, sessionmaker y dependencia get_db

### middleware/
Responsabilidad: manejo transversal de errores. No incluye lógica de autenticación todavía.

---

## 2. Flujo de una petición

Request HTTP
  -> Router (parseo y validación de schema)
    -> Service (lógica de negocio y transacciones)
      -> Model (operaciones ORM)
        -> Database (SQLite)
      <- Response
    <- Router formatea respuesta
  <- Cliente

---

## 3. Base de datos

- ORM: SQLAlchemy 2.0
- Migraciones: Alembic
- Motor inicial: SQLite
- Fuente única de configuración: DATABASE_URL en .env -> app/config.py -> settings.DATABASE_URL
- Cualquier cambio de esquema requiere migración Alembic
- Convención de tablas: plural snake_case en español (categorias, productos, ventas, ordenes_compra)
- PK: Integer autoincrement
- Timestamps: created_at, updated_at en todas las tablas
- Foreign keys: ondelete='RESTRICT'

---

## 4. Modelos

- Todos los modelos heredan de Base.
- Campos comunes disponibles en Base: id, created_at, updated_at.
- Convenciones de nombres:
  - Tablas: plural snake_case en español
  - Columnas: snake_case en español
  - Relaciones: nombre descriptivo en español
- Relaciones ORM: usar relationship() con Mapped[] typing.

---

## 5. Services

- Contienen toda la lógica de negocio.
- Los routers no deben contener lógica.
- No existe capa repository. Los services usan SQLAlchemy directamente sobre models.
- Un método por caso de uso.

---

## 6. Errores

Formato estándar de respuesta:

Exito:
{}
errores de validación:
{
  code: number,
  message: string,
  details: any
}

HTTPException:
{
  code: number,
  message: string
}

Error interno:
{
  code: 500,
  message: string
}

---

## 7. Testing

- Ubicación: backend/tests/
- Separación futura:
  - unit/: pruebas unitarias de services y lógica de negocio
  - integration/: pruebas de integración con base de datos
  - api/: pruebas de endpoints HTTP
- Fixtures base en conftest.py: db_session en memoria

---

## 8. Reglas generales

- No modificar módulos externos al trabajo actual.
- Reutilizar patrones existentes antes de crear nuevos.
- Evitar abstracciones innecesarias.
- La arquitectura crece junto al dominio, no antes.

