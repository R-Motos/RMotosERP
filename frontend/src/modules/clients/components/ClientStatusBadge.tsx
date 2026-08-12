import { Badge } from '@/components/ui/Badge'
import type { ClienteEstado } from '../types/client'

interface ClientStatusBadgeProps {
  estado: ClienteEstado
}

const estadoConfig: Record<ClienteEstado, { variant: 'success' | 'default'; label: string }> = {
  activo: { variant: 'success', label: 'Activo' },
  inactivo: { variant: 'default', label: 'Inactivo' },
}

export function ClientStatusBadge({ estado }: ClientStatusBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
