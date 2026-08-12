import { httpClient } from '@/services/httpClient'
import type { User, UserCreate, UserFilter, UserUpdate } from '../types/user'

export interface RoleOption {
  id: number
  nombre: string
}

export const userService = {
  async list(filters: UserFilter = {}) {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.q) params.set('q', filters.q)
    const query = params.toString()
    return httpClient.get<User[]>(`/usuarios${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<User> {
    return httpClient.get<User>(`/usuarios/${id}`)
  },

  async listRoles(): Promise<RoleOption[]> {
    return httpClient.get<RoleOption[]>('/roles')
  },

  async create(data: UserCreate): Promise<User> {
    return httpClient.post<User>('/usuarios', data)
  },

  async update(id: number, data: UserUpdate): Promise<User> {
    return httpClient.put<User>(`/usuarios/${id}`, data)
  },

  async changeState(id: number, estado: 'activo' | 'inactivo'): Promise<User> {
    return httpClient.put<User>(`/usuarios/${id}/estado`, { estado })
  },
}
