export type CategoriaEstado = 'activo' | 'inactivo'

export interface Categoria {
  id: number
  nombre: string
  created_at: string
  updated_at: string
}

export interface CategoriaFilter {
  q?: string
}

export interface CategoriaCreate {
  nombre: string
}

export interface CategoriaUpdate {
  nombre: string
}
