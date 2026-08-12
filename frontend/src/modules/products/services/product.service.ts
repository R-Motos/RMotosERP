import { httpClient } from '@/services/httpClient'
import type { Producto, ProductoCreate, ProductoFilter, ProductoUpdate, MarcaOption, CategoriaOption, EtiquetaOption } from '../types/product'

export const productService = {
  async list(filters: ProductoFilter = {}) {
    const params = new URLSearchParams()

    if (filters.q) params.set('q', filters.q)
    if (filters.marca_id) params.set('marca_id', String(filters.marca_id))
    if (filters.categoria_id) params.set('categoria_id', String(filters.categoria_id))
    if (filters.etiqueta_id) params.set('etiqueta_id', String(filters.etiqueta_id))
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.size) params.set('size', String(filters.size))
    if (filters.order_by) params.set('order_by', filters.order_by)

    const query = params.toString()
    return httpClient.get<{ items: Producto[]; total: number; page: number; size: number }>(
      `/productos${query ? `?${query}` : ''}`
    )
  },

  async get(id: number): Promise<Producto> {
    return httpClient.get<Producto>(`/productos/${id}`)
  },

  async create(data: ProductoCreate): Promise<Producto> {
    return httpClient.post<Producto>('/productos', data)
  },

  async update(id: number, data: ProductoUpdate): Promise<Producto> {
    return httpClient.put<Producto>(`/productos/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/productos/${id}`)
  },

  async changeState(id: number, estado: Producto['estado']): Promise<Producto> {
    return httpClient.put<Producto>(`/productos/${id}`, { estado })
  },

  async listMarcas(): Promise<MarcaOption[]> {
    return httpClient.get<MarcaOption[]>('/marcas')
  },

  async listCategorias(): Promise<CategoriaOption[]> {
    return httpClient.get<CategoriaOption[]>('/categorias')
  },

  async listEtiquetas(): Promise<EtiquetaOption[]> {
    return httpClient.get<EtiquetaOption[]>('/etiquetas')
  },

  async getCsvTemplate(): Promise<string> {
    return httpClient.get<string>('/productos/csv/template')
  },

  async exportCsv(): Promise<string> {
    return httpClient.get<string>('/productos/csv/export')
  },

  async importCsv(file: File): Promise<{ created: number; updated: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)

    return httpClient.post<{ created: number; updated: number; errors: string[] }>('/productos/csv/import', formData)
  },
}