import { httpClient } from '@/services/httpClient'
import type { Venta, VentaFilter } from '../types/sale'

interface SaleListResponse {
  items: Venta[]
  total: number
}

export type SaleListResult = Venta[] | SaleListResponse

export const saleService = {
  async list(filters: VentaFilter = {}): Promise<SaleListResult> {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.fecha_inicio) params.set('fecha_inicio', filters.fecha_inicio)
    if (filters.fecha_fin) params.set('fecha_fin', filters.fecha_fin)
    if (filters.usuario_id) params.set('usuario_id', String(filters.usuario_id))
    const query = params.toString()
    return httpClient.get(`/ventas${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<Venta> {
    return httpClient.get<Venta>(`/ventas/${id}`)
  },

  async cancel(id: number): Promise<Venta> {
    return httpClient.put<Venta>(`/ventas/${id}`, { estado: 'anulada' })
  },
}
