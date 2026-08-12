import { httpClient } from '@/services/httpClient'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types/category'

export const categoryService = {
  async list() {
    return httpClient.get<Categoria[]>('/categorias')
  },

  async get(id: number): Promise<Categoria> {
    return httpClient.get<Categoria>(`/categorias/${id}`)
  },

  async create(data: CategoriaCreate): Promise<Categoria> {
    return httpClient.post<Categoria>('/categorias', data)
  },

  async update(id: number, data: CategoriaUpdate): Promise<Categoria> {
    return httpClient.put<Categoria>(`/categorias/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/categorias/${id}`)
  },
}
