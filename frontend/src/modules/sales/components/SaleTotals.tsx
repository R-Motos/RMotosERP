const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface SaleTotalsProps {
  subtotal: number
  descuento: number
  total: number
  cantidadItems: number
  cantidadUnidades: number
}

export function SaleTotals({ subtotal, descuento, total, cantidadItems, cantidadUnidades }: SaleTotalsProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-4 text-sm text-neutral-600">
        <span>{cantidadItems} productos</span>
        <span className="text-neutral-300">|</span>
        <span>{Math.round(cantidadUnidades)} unidades</span>
      </div>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>Subtotal</span>
        <span>{formatCOP(subtotal)}</span>
      </div>
      {descuento > 0 && (
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Descuento</span>
          <span>- {formatCOP(descuento)}</span>
        </div>
      )}
      <div className="flex justify-between text-base font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
        <span>Total</span>
        <span>{formatCOP(total)}</span>
      </div>
    </div>
  )
}
