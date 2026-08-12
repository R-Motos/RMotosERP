import { httpClient } from '@/services/httpClient'
import type { Etiqueta, EtiquetaCreate, EtiquetaUpdate } from '../types/tag'

export const tagService = {
  async list() {
    return httpClient.get<Etiqueta[]>('/etiquetas')
  },

  async get(id: number): Promise<Etiqueta> {
    return httpClient.get<Etiqueta>(`/etiquetas/${id}`)
  },

  async create(data: EtiquetaCreate): Promise<Etiqueta> {
    return httpClient.post<Etiqueta>('/etiquetas', data)
  },

  async update(id: number, data: EtiquetaUpdate): Promise<Etiqueta> {
    return httpClient.put<Etiqueta>(`/etiquetas/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/etiquetas/${id}`)
  },
}
