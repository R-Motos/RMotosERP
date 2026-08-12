import { ReactNode } from 'react'
import { cn } from '@/utils/classNames'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface CartSummaryProps {
  subtotal: number
  tax?: number
  total: number
  itemsCount: number
  discount?: number
  footer?: ReactNode
  className?: string
}

export function CartSummary({ subtotal, tax = 0, total, itemsCount, discount = 0, footer, className }: CartSummaryProps) {
  return (
    <div className={cn('px-5 py-4 border-t border-neutral-200 bg-neutral-50/50', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Subtotal</span>
          <span className="font-medium text-neutral-900 tabular-nums">{formatCOP(subtotal)}</span>
        </div>
        {tax > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Impuestos</span>
            <span className="font-medium text-neutral-900 tabular-nums">{formatCOP(tax)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Descuento</span>
            <span className="font-medium text-error-600 tabular-nums">-{formatCOP(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Artículos</span>
          <span className="font-medium text-neutral-900 tabular-nums">{itemsCount}</span>
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-3 mt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">Total</span>
          <span className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCOP(total)}</span>
        </div>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  )
}
