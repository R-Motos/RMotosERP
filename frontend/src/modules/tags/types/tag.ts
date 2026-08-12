export type EtiquetaEstado = 'activo' | 'inactivo'

export interface Etiqueta {
  id: number
  nombre: string
  created_at: string
  updated_at: string
}

export interface EtiquetaFilter {
  q?: string
}

export interface EtiquetaCreate {
  nombre: string
}

export interface EtiquetaUpdate {
  nombre: string
}
