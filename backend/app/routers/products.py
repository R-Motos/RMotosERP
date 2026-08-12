from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.product import (
    ProductoCreate,
    ProductoFilter,
    ProductoListResponse,
    ProductoResponse,
    ProductoUpdate,
    ProductoCSVTemplateResponse,
    ProductoCSVExportResponse,
    ProductoCSVImportResponse,
)
from app.services import product_service

router = APIRouter(prefix='/productos', tags=['productos'], dependencies=[Depends(get_current_active_user)])


def _build_filter(
    q: str | None = Query(None),
    marca_id: int | None = Query(None),
    categoria_id: int | None = Query(None),
    etiqueta_id: int | None = Query(None),
    estado: str | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    order_by: str = Query('id'),
) -> ProductoFilter:
    estado_enum = None
    if estado:
        from app.models.product import ProductoEstado
        try:
            estado_enum = ProductoEstado(estado)
        except ValueError:
            estado_enum = None
    return ProductoFilter(
        q=q,
        marca_id=marca_id,
        categoria_id=categoria_id,
        etiqueta_id=etiqueta_id,
        estado=estado_enum,
        page=page,
        size=size,
        order_by=order_by,
    )


@router.post('', response_model=ProductoResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('productos'))])
def create_producto(producto_in: ProductoCreate, db: Session = Depends(get_db)):
    try:
        return product_service.create(db, producto_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('', response_model=ProductoListResponse, dependencies=[Depends(require_permission('productos'))])
def list_productos(filters: ProductoFilter = Depends(_build_filter), db: Session = Depends(get_db)):
    items, total = product_service.list(db, filters)
    return ProductoListResponse(items=items, total=total, page=filters.page, size=filters.size)


@router.get('/{producto_id}', response_model=ProductoResponse, dependencies=[Depends(require_permission('productos'))])
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = product_service.get(db, producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Producto no encontrado',
        )
    return producto


@router.put('/{producto_id}', response_model=ProductoResponse, dependencies=[Depends(require_permission('productos'))])
def update_producto(
    producto_id: int,
    producto_in: ProductoUpdate,
    db: Session = Depends(get_db),
):
    try:
        producto = product_service.update(db, producto_id, producto_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Producto no encontrado',
        )
    return producto


@router.get('/csv/template', response_model=ProductoCSVTemplateResponse, dependencies=[Depends(require_permission('productos'))])
def get_csv_template():
    """Download CSV template for product import."""
    return ProductoCSVTemplateResponse(
        content=product_service.get_csv_template()
    )


@router.get('/csv/export', response_model=ProductoCSVExportResponse, dependencies=[Depends(require_permission('productos'))])
def export_csv(db: Session = Depends(get_db)):
    """Export all products to CSV."""
    return ProductoCSVExportResponse(
        content=product_service.export_csv(db)
    )


@router.post('/csv/import', response_model=ProductoCSVImportResponse, dependencies=[Depends(require_permission('productos'))])
async def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import products from CSV file."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='El archivo debe ser CSV')
    
    try:
        content = await file.read()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No se pudo leer el archivo')
    
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='El archivo está vacío')
    
    try:
        csv_content = content.decode('utf-8')
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='El archivo no es texto CSV válido')
    
    try:
        result = product_service.import_csv(db, csv_content)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Error de validación: {str(e)}')
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Error inesperado: {str(e)}')
    
    return ProductoCSVImportResponse(**result)
