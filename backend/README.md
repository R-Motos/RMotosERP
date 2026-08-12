# RMotos ERP

Backend del sistema de gestion RMotos.

## Desarrollo

```bash
cd backend
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

## Migraciones

```bash
alembic upgrade head
```

