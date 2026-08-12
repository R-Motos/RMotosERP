import { httpClient } from '@/services/httpClient'
import type { Proveedor, ProveedorCreate, ProveedorFilter, ProveedorUpdate } from '../types/supplier'

export const supplierService = {
  async list(filters: ProveedorFilter = {}) {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.q) params.set('q', filters.q)
    const query = params.toString()
    return httpClient.get<Proveedor[]>(`/proveedores${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<Proveedor> {
    return httpClient.get<Proveedor>(`/proveedores/${id}`)
  },

  async create(data: ProveedorCreate): Promise<Proveedor> {
    return httpClient.post<Proveedor>('/proveedores', data)
  },

  async update(id: number, data: ProveedorUpdate): Promise<Proveedor> {
    return httpClient.put<Proveedor>(`/proveedores/${id}`, data)
  },

  async changeState(id: number, estado: Proveedor['estado']): Promise<Proveedor> {
    return httpClient.put<Proveedor>(`/proveedores/${id}`, { estado })
  },
}
