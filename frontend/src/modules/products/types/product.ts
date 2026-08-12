export interface ProductoMarca {
  id: number
  nombre: string
}

export interface ProductoCategoria {
  id: number
  nombre: string
}

export interface ProductoEtiqueta {
  id: number
  nombre: string
}

export type ProductoEstado = 'publicado' | 'pendiente' | 'inactivo'

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
  marca: ProductoMarca | null
  categorias: ProductoCategoria[]
  etiquetas: ProductoEtiqueta[]
  estado: ProductoEstado
  created_at: string
  updated_at: string
}

export interface ProductoListResponse {
  items: Producto[]
  total: number
  page: number
  size: number
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

export interface ProductoCreate {
  nombre: string
  imagen?: string
  sku?: string
  codigo_barras?: string
  precio_compra: number
  precio_venta: number
  gestionar_inventario?: boolean
  cantidad_disponible?: number
  stock_minimo?: number
  marca_id?: number
  categoria_ids?: number[]
  etiqueta_ids?: number[]
  estado?: ProductoEstado
}

export interface ProductoUpdate {
  nombre?: string
  imagen?: string | null
  sku?: string | null
  codigo_barras?: string | null
  precio_compra?: number
  precio_venta?: number
  gestionar_inventario?: boolean
  cantidad_disponible?: number
  stock_minimo?: number
  marca_id?: number | null
  categoria_ids?: number[] | null
  etiqueta_ids?: number[] | null
  estado?: ProductoEstado
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