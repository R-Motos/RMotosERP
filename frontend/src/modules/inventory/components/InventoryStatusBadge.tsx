import { Badge } from '@/components/ui/Badge'
import type { InventarioEstadoVisual } from '../types/inventory'

interface InventoryStatusBadgeProps {
  estado: InventarioEstadoVisual
}

const estadoConfig: Record<InventarioEstadoVisual, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  normal: { variant: 'success', label: 'Normal' },
  bajo: { variant: 'warning', label: 'Bajo stock' },
  sin_stock: { variant: 'error', label: 'Sin stock' },
}

export function InventoryStatusBadge({ estado }: InventoryStatusBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
