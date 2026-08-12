import { httpClient } from '@/services/httpClient'
import type { Marca, MarcaCreate, MarcaUpdate } from '../types/brand'

export const brandService = {
  async list() {
    return httpClient.get<Marca[]>('/marcas')
  },

  async get(id: number): Promise<Marca> {
    return httpClient.get<Marca>(`/marcas/${id}`)
  },

  async create(data: MarcaCreate): Promise<Marca> {
    return httpClient.post<Marca>('/marcas', data)
  },

  async update(id: number, data: MarcaUpdate): Promise<Marca> {
    return httpClient.put<Marca>(`/marcas/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/marcas/${id}`)
  },
}
