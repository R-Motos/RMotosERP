const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PurchaseOrderSummaryProps {
  detalles: Array<{ subtotal: number; cantidad: number }>
  disabled?: boolean
}

export function PurchaseOrderSummary({ detalles, disabled: _disabled }: PurchaseOrderSummaryProps) {
  const total = detalles.reduce((sum, d) => sum + d.subtotal, 0)
  const totalItems = detalles.reduce((sum, d) => sum + d.cantidad, 0)

  return (
    <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm text-neutral-600">
        <span>Productos:</span>
        <span>{detalles.length}</span>
      </div>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>Unidades totales:</span>
        <span>{Math.round(totalItems)}</span>
      </div>
      <div className="flex justify-between text-base font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
        <span>Total:</span>
        <span>{formatCOP(total)}</span>
      </div>
    </div>
  )
}
