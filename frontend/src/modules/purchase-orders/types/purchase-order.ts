export type OrdenCompraEstado = 'borrador' | 'enviada' | 'parcialmente_recibida' | 'completada' | 'cancelada'

export interface OrdenCompraDetalle {
  id: number
  orden_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto_nombre?: string
}

export interface DetalleItem extends OrdenCompraDetalleCreate {
  id?: number
  orden_id?: number
  producto_nombre?: string
  subtotal: number
}

export interface OrdenCompra {
  id: number
  numero: string
  proveedor_id: number
  proveedor_nombre?: string
  usuario_id: number
  estado: OrdenCompraEstado
  observaciones: string | null
  total: number
  created_at: string
  updated_at: string
  detalles: OrdenCompraDetalle[]
}

export interface OrdenCompraFilter {
  estado?: OrdenCompraEstado
}

export interface OrdenCompraDetalleCreate {
  producto_id: number
  cantidad: number
  precio_unitario: number
}

export interface OrdenCompraCreate {
  proveedor_id: number
  usuario_id: number
  observaciones?: string | null
  estado?: OrdenCompraEstado
  detalles: OrdenCompraDetalleCreate[]
}

export interface OrdenCompraUpdate {
  observaciones?: string | null
  estado?: OrdenCompraEstado
}

export const ESTADOS_INMODIFICABLES = ['completada', 'cancelada'] as const

