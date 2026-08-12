export type AuditAccion = 'crear' | 'editar' | 'eliminar' | 'anular' | 'aprobar' | 'login' | 'logout'

export interface AuditLog {
  id: number
  usuario_id: number
  modulo: string
  accion: AuditAccion
  registro_id: number
  descripcion: string
  datos_anteriores: string | null
  datos_nuevos: string | null
  created_at: string
}

export interface AuditLogListResponse {
  items: AuditLog[]
  total: number
  page: number
  size: number
}

export interface AuditFilter {
  usuario_id?: number
  modulo?: string
  accion?: AuditAccion
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
  size?: number
}
