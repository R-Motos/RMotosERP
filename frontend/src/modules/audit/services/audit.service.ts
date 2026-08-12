import { httpClient } from '@/services/httpClient'
import type { AuditLog, AuditLogListResponse, AuditFilter } from '../types/audit'

export const auditService = {
  async list(filters: AuditFilter = {}): Promise<AuditLogListResponse> {
    const params = new URLSearchParams()
    if (filters.usuario_id) params.set('usuario_id', String(filters.usuario_id))
    if (filters.modulo) params.set('modulo', filters.modulo)
    if (filters.accion) params.set('accion', filters.accion)
    if (filters.fecha_inicio) params.set('fecha_inicio', filters.fecha_inicio)
    if (filters.fecha_fin) params.set('fecha_fin', filters.fecha_fin)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.size) params.set('size', String(filters.size))
    const query = params.toString()
    return httpClient.get<AuditLogListResponse>(`/audit${query ? `?${query}` : ''}`)
  },

  async get(id: number): Promise<AuditLog> {
    return httpClient.get<AuditLog>(`/audit/${id}`)
  },
}
