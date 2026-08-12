export type UserEstado = 'activo' | 'inactivo'

export interface RoleSimple {
  id: number
  nombre: string
  descripcion: string | null
  estado: string
  es_fijo: boolean
}

export interface User {
  id: number
  nombre: string
  username: string
  email: string | null
  telefono: string | null
  roles: RoleSimple[]
  estado: UserEstado
  modules: string[]
  created_at: string
  updated_at: string
}

export interface UserFilter {
  estado?: UserEstado
  q?: string
}

export interface UserCreate {
  nombre: string
  username: string
  email?: string
  telefono?: string
  pin?: string
  rol_ids?: number[]
  estado?: UserEstado
}

export interface UserUpdate {
  nombre?: string
  username?: string
  email?: string
  telefono?: string
  pin?: string
  rol_ids?: number[]
  modules?: string[]
  estado?: UserEstado
}
