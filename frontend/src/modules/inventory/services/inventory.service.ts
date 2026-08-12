import { httpClient } from '@/services/httpClient'
import type { Producto, ProductoFilter, MarcaOption, CategoriaOption, EtiquetaOption } from '../types/inventory'

export const inventoryService = {
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

  async listMarcas(): Promise<MarcaOption[]> {
    return httpClient.get<MarcaOption[]>('/marcas')
  },

  async listCategorias(): Promise<CategoriaOption[]> {
    return httpClient.get<CategoriaOption[]>('/categorias')
  },

  async listEtiquetas(): Promise<EtiquetaOption[]> {
    return httpClient.get<EtiquetaOption[]>('/etiquetas')
  },
}
