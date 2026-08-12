import { httpClient } from '@/services/httpClient'
import type { Cliente, ClienteCreate, ClienteFilter, ClienteUpdate } from '../types/client'

export const clientService = {
  async list(filters: ClienteFilter = {}) {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.q) params.set('q', filters.q)
    const query = params.toString()
    return httpClient.get<Cliente[]>(`/clientes${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<Cliente> {
    return httpClient.get<Cliente>(`/clientes/${id}`)
  },

  async create(data: ClienteCreate): Promise<Cliente> {
    return httpClient.post<Cliente>('/clientes', data)
  },

  async update(id: number, data: ClienteUpdate): Promise<Cliente> {
    return httpClient.put<Cliente>(`/clientes/${id}`, data)
  },

  async changeState(id: number, estado: Cliente['estado']): Promise<Cliente> {
    return httpClient.put<Cliente>(`/clientes/${id}`, { estado })
  },
}
