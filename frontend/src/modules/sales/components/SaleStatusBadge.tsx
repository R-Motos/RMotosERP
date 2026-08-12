import { Badge } from '@/components/ui/Badge'
import type { VentaEstado } from '../types/sale'

interface SaleStatusBadgeProps {
  estado: VentaEstado
}

const estadoConfig: Record<VentaEstado, { variant: 'success' | 'default' | 'error' | 'warning'; label: string }> = {
  pendiente: { variant: 'warning', label: 'Pendiente' },
  completada: { variant: 'success', label: 'Completada' },
  anulada: { variant: 'error', label: 'Anulada' },
}

export function SaleStatusBadge({ estado }: SaleStatusBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
