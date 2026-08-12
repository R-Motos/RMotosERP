export type RecepcionCompraEstado = 'pendiente' | 'completada' | 'cancelada'

export interface RecepcionCompraDetalleCreate {
  producto_id: number
  cantidad_recibida: number
  precio_unitario: number
}

export interface DetalleItem extends RecepcionCompraDetalleCreate {
  id: number
  producto_nombre?: string
  cantidad_solicitada: number
  subtotal: number
}

export interface RecepcionCompraDetalle extends RecepcionCompraDetalleCreate {
  id: number
  recepcion_id: number
}

export interface RecepcionCompraCreate {
  orden_compra_id: number
  proveedor_id: number
  usuario_id: number
  observaciones?: string | null
  estado?: RecepcionCompraEstado
  detalles: RecepcionCompraDetalleCreate[]
}

export interface RecepcionCompra {
  id: number
  orden_compra_id: number
  proveedor_id: number
  usuario_id: number
  fecha: string
  observaciones: string | null
  estado: RecepcionCompraEstado
  created_at: string
  updated_at: string
  detalles: RecepcionCompraDetalle[]
}

export interface RecepcionCompraFilter {
  estado?: RecepcionCompraEstado
}
