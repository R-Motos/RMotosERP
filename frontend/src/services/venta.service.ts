import { httpClient } from '@/services/httpClient'
import type { VentaCreate, VentaResponse } from '@/modules/sales/types/sale'

export const ventaService = {
  async create(venta: VentaCreate): Promise<VentaResponse> {
    return httpClient.post<VentaResponse>('/ventas', venta)
  },

  async list(estado?: string): Promise<VentaResponse[]> {
    const query = estado ? `?estado=${estado}` : ''
    return httpClient.get<VentaResponse[]>(`/ventas${query}`)
  },

  async get(id: number): Promise<VentaResponse> {
    return httpClient.get<VentaResponse>(`/ventas/${id}`)
  },
}