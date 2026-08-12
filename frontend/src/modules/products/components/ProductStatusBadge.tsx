import { Badge } from '@/components/ui/Badge'
import type { ProductoEstado } from '../types/product'

interface ProductStatusBadgeProps {
  estado: ProductoEstado
}

const estadoConfig: Record<ProductoEstado, { variant: 'success' | 'warning' | 'default'; label: string }> = {
  publicado: { variant: 'success', label: 'Publicado' },
  pendiente: { variant: 'warning', label: 'Pendiente' },
  inactivo: { variant: 'default', label: 'Inactivo' },
}

export function ProductStatusBadge({ estado }: ProductStatusBadgeProps) {
  const config = estadoConfig[estado]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
