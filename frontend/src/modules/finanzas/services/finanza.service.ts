import { httpClient } from '@/services/httpClient'
import type { MovimientoFinanciero, MovimientoFinancieroCreate, MovimientoFinancieroUpdate } from '../types/finanza'

interface FinanzasListResponse {
  items: MovimientoFinanciero[]
  total: number
  page: number
  size: number
}

interface FinanzasOverview {
  total_ingresos: number
  ingresos_venta: number
  ingresos_manual: number
  total_egresos: number
  egresos_compra: number
  egresos_manual: number
  balance: number
  inventario_valor: number
  profit_esperado: number
}

export const financaService = {
  async list(page: number = 1, size: number = 5) {
    return httpClient.get<FinanzasListResponse>(`/movimientos-financieros?page=${page}&size=${size}`)
  },

  async get(id: number): Promise<MovimientoFinanciero> {
    return httpClient.get<MovimientoFinanciero>(`/movimientos-financieros/${id}`)
  },

  async create(data: MovimientoFinancieroCreate): Promise<MovimientoFinanciero> {
    return httpClient.post<MovimientoFinanciero>('/movimientos-financieros', data)
  },

  async update(id: number, data: MovimientoFinancieroUpdate): Promise<MovimientoFinanciero> {
    return httpClient.put<MovimientoFinanciero>(`/movimientos-financieros/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/movimientos-financieros/${id}`)
  },

  async getOverview(): Promise<FinanzasOverview> {
    return httpClient.get<FinanzasOverview>('/movimientos-financieros/overview')
  },
}