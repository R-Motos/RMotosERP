export interface ResumenVentas {
  cantidad_ventas: number
  total_vendido: number
  promedio_venta: number
}

export interface ResumenInventario {
  cantidad_productos: number
  productos_bajo_stock: number
  valor_inventario: number
}

export interface ResumenClientes {
  cantidad_clientes: number
  clientes_con_compras: number
}

export interface ResumenFinanzas {
  ingresos_totales: number
  egresos_totales: number
  balance: number
}

export interface ResumenResponse {
  ventas: ResumenVentas
  inventario: ResumenInventario
  clientes: ResumenClientes
  finanzas: ResumenFinanzas
}

export interface VentasPorDia {
  fecha: string
  total_vendido: number
  cantidad_ventas: number
}

export interface VentasResponse {
  items: VentasPorDia[]
  total: number
}

export interface ProductoBajoStock {
  id: number
  nombre: string
  cantidad_disponible: number
  stock_minimo: number
}

export interface ProductoMovimiento {
  id: number
  nombre: string
  total_vendido: number
}

export interface ProductoSinMovimiento {
  id: number
  nombre: string
}

export interface ProductosResponse {
  mas_vendidos: ProductoMovimiento[]
  sin_movimiento: ProductoSinMovimiento[]
  bajo_stock: ProductoBajoStock[]
}

export interface FinanzasTipo {
  tipo: string
  total: number
  cantidad: number
}

export interface OrdenResponse {
  id: number
  numero: string
  estado: string
  total: number
}

export interface FinanzasResponse {
  ingresos_totales: number
  egresos_totales: number
  balance: number
  por_tipo: FinanzasTipo[]
}
