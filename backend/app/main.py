from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.db.session import SessionLocal
from app.middleware.error_handler import (
    generic_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.services.rbac_service import initialize_rbac
from app.routers import categories, brands, tags, products, clients, users, auth, suppliers, inventory_movements, purchase_orders, purchase_receipts, sales, financial_movements, dashboard, audit_logs, system_config, coupons, roles, pos

api_router = APIRouter(prefix='/api', redirect_slashes=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        initialize_rbac(db)
    finally:
        db.close()
    yield


api_router.include_router(categories.router)
api_router.include_router(brands.router)
api_router.include_router(tags.router)
api_router.include_router(products.router)
api_router.include_router(clients.router)
api_router.include_router(users.router)
api_router.include_router(auth.router)
api_router.include_router(suppliers.router)
api_router.include_router(inventory_movements.router)
api_router.include_router(purchase_orders.router)
api_router.include_router(purchase_receipts.router)
api_router.include_router(sales.router)
api_router.include_router(financial_movements.router)
api_router.include_router(dashboard.router)
api_router.include_router(audit_logs.router)
api_router.include_router(system_config.router)
api_router.include_router(coupons.router)
api_router.include_router(roles.router)
api_router.include_router(pos.router)

app = FastAPI(title='RMotos ERP', version='0.1.0', lifespan=lifespan)
app.router.redirect_slashes = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(','),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(api_router)


@app.get('/')
def health_check():
    return {'status': 'ok'}
