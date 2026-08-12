const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PurchaseOrderTotalsProps {
  total: number
  cantidadItems: number
  cantidadUnidades: number
}

export function PurchaseOrderTotals({ total, cantidadItems, cantidadUnidades }: PurchaseOrderTotalsProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-4 text-sm text-neutral-600">
          <span>{cantidadItems} productos</span>
          <span className="text-neutral-300">|</span>
          <span>{Math.round(cantidadUnidades)} unidades</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-neutral-500">Total</p>
        <p className="text-2xl font-bold text-neutral-900">{formatCOP(total)}</p>
      </div>
    </div>
  )
}
