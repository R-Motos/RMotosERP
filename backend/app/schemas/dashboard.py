from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ResumenVentas(BaseModel):
    cantidad_ventas: int
    total_vendido: int
    promedio_venta: float


class ResumenInventario(BaseModel):
    cantidad_productos: int
    productos_bajo_stock: int
    valor_inventario: int


class ResumenClientes(BaseModel):
    cantidad_clientes: int
    clientes_con_compras: int


class ResumenFinanzas(BaseModel):
    ingresos_totales: int
    egresos_totales: int
    balance: int


class ResumenResponse(BaseModel):
    ventas: ResumenVentas
    inventario: ResumenInventario
    clientes: ResumenClientes
    finanzas: ResumenFinanzas


class VentasPorDia(BaseModel):
    fecha: datetime
    total_vendido: int
    cantidad_ventas: int


class VentasResponse(BaseModel):
    items: list[VentasPorDia]
    total: int


class ProductoBajoStock(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    cantidad_disponible: int
    stock_minimo: int


class ProductoMovimiento(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    total_vendido: int


class ProductosResponse(BaseModel):
    mas_vendidos: list[ProductoMovimiento]
    sin_movimiento: list[dict]
    bajo_stock: list[ProductoBajoStock]


class FinanzasTipo(BaseModel):
    tipo: str
    total: int
    cantidad: int


class FinanzasResponse(BaseModel):
    ingresos_totales: int
    egresos_totales: int
    balance: int
    por_tipo: list[FinanzasTipo]
