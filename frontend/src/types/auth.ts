export type UserRole = 'administrador' | 'gestor' | 'vendedor'

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
  modules: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
