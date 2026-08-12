import { httpClient } from '@/services/httpClient'
import type { Cupon, CuponCreate, CuponFilter, CuponUpdate } from '../types/coupon'

export const couponService = {
  async list(filters: CuponFilter = {}) {
    const params = new URLSearchParams()
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.q) params.set('q', filters.q)
    const query = params.toString()
    return httpClient.get<Cupon[]>(`/cupones${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<Cupon> {
    return httpClient.get<Cupon>(`/cupones/${id}`)
  },

  async create(data: CuponCreate): Promise<Cupon> {
    return httpClient.post<Cupon>('/cupones', data)
  },

  async update(id: number, data: CuponUpdate): Promise<Cupon> {
    return httpClient.put<Cupon>(`/cupones/${id}`, data)
  },

  async changeState(id: number, estado: 'activo' | 'inactivo'): Promise<Cupon> {
    return httpClient.patch<Cupon>(`/cupones/${id}/estado`, { estado })
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete(`/cupones/${id}`)
  },
}
