import { Badge } from '@/components/ui/Badge'
import type { ProveedorEstado } from '../types/supplier'

interface SupplierStatusBadgeProps {
  estado: ProveedorEstado
}

const estadoConfig: Record<ProveedorEstado, { variant: 'success' | 'default'; label: string }> = {
  activo: { variant: 'success', label: 'Activo' },
  inactivo: { variant: 'default', label: 'Inactivo' },
}

export function SupplierStatusBadge({ estado }: SupplierStatusBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
