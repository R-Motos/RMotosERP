import { httpClient } from '@/services/httpClient'
import type { RecepcionCompra, RecepcionCompraCreate, RecepcionCompraFilter } from '../types/purchase-receipt'

export const purchaseReceiptService = {
  async list(filters: RecepcionCompraFilter = {}): Promise<RecepcionCompra[]> {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    const query = params.toString()
    return httpClient.get<RecepcionCompra[]>(`/recepciones-compra${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<RecepcionCompra> {
    return httpClient.get<RecepcionCompra>(`/recepciones-compra/${id}`)
  },

  async create(data: RecepcionCompraCreate): Promise<RecepcionCompra> {
    return httpClient.post<RecepcionCompra>('/recepciones-compra', data)
  },
}
