import { Badge } from '@/components/ui/Badge'
import type { Cupon } from '../types/coupon'

interface CouponViewProps {
  product: Cupon
  onClose?: () => void
}

export function CouponView({ product, onClose }: CouponViewProps) {
  const tipoBadge = product.tipo === 'porcentaje'
    ? { label: 'Porcentaje', variant: 'default' as const }
    : { label: 'Valor fijo', variant: 'default' as const }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-primary-600">%</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 font-mono">{product.codigo}</h3>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant={tipoBadge.variant}>{tipoBadge.label}</Badge>
            <Badge variant={product.estado === 'activo' ? 'success' : 'error'}>
              {product.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Valor</p>
          <p className="text-sm font-semibold text-neutral-900">
            {product.tipo === 'porcentaje' ? `${product.valor}%` : `S/ ${Number(product.valor).toFixed(2)}`}
          </p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Usos</p>
          <p className="text-sm font-semibold text-neutral-900">
            {product.usos_realizados} / {product.uso_maximo}
          </p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Fecha inicio</p>
          <p className="text-sm font-semibold text-neutral-900">{new Date(product.fecha_inicio).toLocaleDateString('es-PE')}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Fecha fin</p>
          <p className="text-sm font-semibold text-neutral-900">{new Date(product.fecha_fin).toLocaleDateString('es-PE')}</p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
