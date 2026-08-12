import { httpClient } from '@/services/httpClient'
import type { OrdenCompra, OrdenCompraCreate, OrdenCompraFilter, OrdenCompraUpdate } from '../types/purchase-order'

export const purchaseOrderService = {
  async list(filters: OrdenCompraFilter = {}): Promise<OrdenCompra[]> {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    const query = params.toString()
    return httpClient.get<OrdenCompra[]>(`/ordenes-compra${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<OrdenCompra> {
    return httpClient.get<OrdenCompra>(`/ordenes-compra/${id}`)
  },

  async create(data: OrdenCompraCreate): Promise<OrdenCompra> {
    return httpClient.post<OrdenCompra>('/ordenes-compra', data)
  },

  async update(id: number, data: OrdenCompraUpdate): Promise<OrdenCompra> {
    return httpClient.put<OrdenCompra>(`/ordenes-compra/${id}`, data)
  },
}
