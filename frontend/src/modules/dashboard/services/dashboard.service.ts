import { httpClient } from '@/services/httpClient'
import type { ResumenResponse, VentasResponse, ProductosResponse, FinanzasResponse } from '../types/dashboard'

export const dashboardService = {
  async getResumen(): Promise<ResumenResponse> {
    return httpClient.get<ResumenResponse>('/dashboard/resumen')
  },

  async getVentas(fechaInicio?: Date, fechaFin?: Date): Promise<VentasResponse> {
    const params = new URLSearchParams()
    if (fechaInicio) params.set('fecha_inicio', fechaInicio.toISOString())
    if (fechaFin) params.set('fecha_fin', fechaFin.toISOString())
    const query = params.toString()
    return httpClient.get<VentasResponse>(`/dashboard/ventas${query ? `?${query}` : ''}`)
  },

  async getProductos(): Promise<ProductosResponse> {
    return httpClient.get<ProductosResponse>('/dashboard/productos')
  },

  async getFinanzas(): Promise<FinanzasResponse> {
    return httpClient.get<FinanzasResponse>('/dashboard/finanzas')
  },
}
