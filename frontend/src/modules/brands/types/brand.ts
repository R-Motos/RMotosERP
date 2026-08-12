export type MarcaEstado = 'activo' | 'inactivo'

export interface Marca {
  id: number
  nombre: string
  created_at: string
  updated_at: string
}

export interface MarcaFilter {
  q?: string
}

export interface MarcaCreate {
  nombre: string
}

export interface MarcaUpdate {
  nombre: string
}
