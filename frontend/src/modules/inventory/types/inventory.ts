export type ProductoEstado = 'publicado' | 'pendiente' | 'inactivo'

export type InventarioEstadoVisual = 'normal' | 'bajo' | 'sin_stock'

export interface Producto {
  id: number
  nombre: string
  imagen: string | null
  sku: string | null
  codigo_barras: string | null
  precio_compra: number
  precio_venta: number
  gestionar_inventario: boolean
  cantidad_disponible: number
  stock_minimo: number
  marca: { id: number; nombre: string } | null
  categorias: { id: number; nombre: string }[]
  etiquetas: { id: number; nombre: string }[]
  estado: ProductoEstado
  created_at: string
  updated_at: string
}

export interface ProductoFilter {
  q?: string
  marca_id?: number
  categoria_id?: number
  etiqueta_id?: number
  estado?: ProductoEstado
  page?: number
  size?: number
  order_by?: string
}

export interface MarcaOption {
  id: number
  nombre: string
}

export interface CategoriaOption {
  id: number
  nombre: string
}

export interface EtiquetaOption {
  id: number
  nombre: string
}

export function getInventarioEstadoVisual(producto: Producto): InventarioEstadoVisual {
  if (producto.cantidad_disponible <= 0) return 'sin_stock'
  if (producto.cantidad_disponible <= producto.stock_minimo) return 'bajo'
  return 'normal'
}
