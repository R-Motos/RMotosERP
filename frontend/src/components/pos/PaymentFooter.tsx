import { ReactNode } from 'react'
import { cn } from '@/utils/classNames'
import { Button } from '@/components/ui/Button'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PaymentFooterProps {
  total: number
  itemsCount: number
  onPay?: () => void
  disabled?: boolean
  loading?: boolean
  action?: ReactNode
  className?: string
}

export function PaymentFooter({ total, itemsCount, onPay, disabled, loading, action, className }: PaymentFooterProps) {
  return (
    <div
      className={cn(
        'bg-neutral-50 border-t border-neutral-200 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600" />
          </span>
          <span className="text-sm font-medium text-neutral-700">
            {itemsCount} {itemsCount === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Total</p>
          <p className="text-2xl font-bold text-primary-700 tabular-nums">{formatCOP(total)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {action}
        <Button
          variant="primary"
          size="lg"
          className="flex-1 h-12 text-base font-semibold shadow-sm"
          disabled={disabled || itemsCount === 0}
          loading={loading}
          onClick={onPay}
        >
          Pagar
        </Button>
      </div>
    </div>
  )
}
