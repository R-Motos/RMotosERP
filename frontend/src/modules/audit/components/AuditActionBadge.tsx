import { Badge } from '@/components/ui/Badge'
import type { AuditAccion } from '../types/audit'

interface AuditActionBadgeProps {
  accion: AuditAccion
}

const accionConfig: Record<AuditAccion, { variant: 'success' | 'default' | 'warning' | 'error' | 'primary'; label: string }> = {
  crear: { variant: 'success', label: 'Crear' },
  editar: { variant: 'primary', label: 'Editar' },
  eliminar: { variant: 'error', label: 'Eliminar' },
  anular: { variant: 'warning', label: 'Anular' },
  aprobar: { variant: 'success', label: 'Aprobar' },
  login: { variant: 'default', label: 'Login' },
  logout: { variant: 'default', label: 'Logout' },
}

export function AuditActionBadge({ accion }: AuditActionBadgeProps) {
  const config = accionConfig[accion]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
