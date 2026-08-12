from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict

from app.models.product import ProductoEstado


class MarcaSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str


class CategoriaSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str


class EtiquetaSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str


class ProductoFilter(BaseModel):
    q: str | None = None
    marca_id: int | None = None
    categoria_id: int | None = None
    etiqueta_id: int | None = None
    estado: ProductoEstado | None = None
    page: int = 1
    size: int = 20
    order_by: str = 'id'


class ProductoCreate(BaseModel):
    nombre: str
    imagen: str | None = None
    sku: str | None = None
    codigo_barras: str | None = None
    precio_compra: int
    precio_venta: int
    gestionar_inventario: bool = True
    cantidad_disponible: int = 0
    stock_minimo: int = 0
    marca_id: int | None = None
    categoria_ids: list[int] | None = None
    etiqueta_ids: list[int] | None = None
    estado: ProductoEstado = ProductoEstado.pendiente


class ProductoUpdate(BaseModel):
    nombre: str | None = None
    imagen: str | None = None
    sku: str | None = None
    codigo_barras: str | None = None
    precio_compra: int | None = None
    precio_venta: int | None = None
    gestionar_inventario: bool | None = None
    cantidad_disponible: int | None = None
    stock_minimo: int | None = None
    marca_id: int | None = None
    categoria_ids: list[int] | None = None
    etiqueta_ids: list[int] | None = None
    estado: ProductoEstado | None = None


class ProductoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    imagen: str | None
    sku: str | None
    codigo_barras: str | None
    precio_compra: int
    precio_venta: int
    gestionar_inventario: bool
    cantidad_disponible: int
    stock_minimo: int
    marca: MarcaSimple | None
    categorias: list[CategoriaSimple]
    etiquetas: list[EtiquetaSimple]
    estado: ProductoEstado
    created_at: datetime
    updated_at: datetime


class ProductoListResponse(BaseModel):
    items: list[ProductoResponse]
    total: int
    page: int
    size: int


class ProductoCSVTemplateResponse(BaseModel):
    content: str
    filename: str = "productos_template.csv"


class ProductoCSVExportResponse(BaseModel):
    content: str
    filename: str = "productos_export.csv"


class ProductoCSVImportResponse(BaseModel):
    created: int
    updated: int
    errors: list[str]
