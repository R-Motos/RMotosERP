export type VentaEstado = 'pendiente' | 'completada' | 'anulada'

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro'

export interface VentaDetalle {
  id: number
  venta_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  descuento: number
  subtotal: number
  created_at: string
  updated_at: string
  producto_nombre?: string
  producto_sku?: string | null
  producto_imagen?: string | null
}

export interface Venta {
  id: number
  numero: string
  usuario_id: number
  cliente_id: number | null
  fecha_venta: string
  subtotal: number
  descuento: number
  total: number
  metodo_pago: MetodoPago
  estado: VentaEstado
  created_at: string
  updated_at: string
  detalles: VentaDetalle[]
  cliente_nombre?: string
  usuario_nombre?: string
}

export interface VentaFilter {
  estado?: VentaEstado
  fecha_inicio?: string
  fecha_fin?: string
  usuario_id?: number
  q?: string
}

export interface VentaListResponse {
  items: Venta[]
  total: number
}

export interface VentaDetalleCreate {
  producto_id: number
  cantidad: number
  precio_unitario: number
  descuento: number
}

export interface VentaCreate {
  usuario_id: number
  cliente_id: number | null
  metodo_pago: MetodoPago
  estado: 'completada'
  descuento: number
  detalles: VentaDetalleCreate[]
}

export interface VentaResponse {
  id: number
  numero: string
  usuario_id: number
  cliente_id: number | null
  fecha_venta: string
  subtotal: number
  descuento: number
  total: number
  metodo_pago: string
  estado: string
  created_at: string
  updated_at: string
  detalles: VentaDetalleResponse[]
}

export interface VentaDetalleResponse {
  id: number
  venta_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  descuento: number
  subtotal: number
  created_at: string
  updated_at: string
}

export const ESTADOS_INMODIFICABLES: VentaEstado[] = ['anulada']
