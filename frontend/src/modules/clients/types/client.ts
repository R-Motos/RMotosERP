export type ClienteEstado = 'activo' | 'inactivo'

export interface Cliente {
  id: number
  nombre: string
  email: string | null
  telefono: string | null
  cantidad_compras: number
  total_gastado: number
  estado: ClienteEstado
  created_at: string
  updated_at: string
}

export interface ClienteFilter {
  estado?: ClienteEstado
  q?: string
}

export interface ClienteCreate {
  nombre: string
  email?: string | null
  telefono?: string | null
  estado?: ClienteEstado
}

export interface ClienteUpdate {
  nombre?: string
  email?: string | null
  telefono?: string | null
  estado?: ClienteEstado
}
