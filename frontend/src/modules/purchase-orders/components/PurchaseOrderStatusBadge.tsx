import { Badge } from '@/components/ui/Badge'
import type { OrdenCompraEstado } from '../types/purchase-order'

interface PurchaseOrderStatusBadgeProps {
  estado: OrdenCompraEstado
}

const estadoConfig: Record<OrdenCompraEstado, { variant: 'success' | 'warning' | 'default' | 'error'; label: string }> = {
  borrador: { variant: 'default', label: 'Borrador' },
  enviada: { variant: 'warning', label: 'Enviada' },
  parcialmente_recibida: { variant: 'warning', label: 'Parcialmente recibida' },
  completada: { variant: 'success', label: 'Completada' },
  cancelada: { variant: 'error', label: 'Cancelada' },
}

export function PurchaseOrderStatusBadge({ estado }: PurchaseOrderStatusBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
