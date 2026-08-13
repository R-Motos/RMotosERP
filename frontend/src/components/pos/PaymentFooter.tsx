import { ReactNode } from 'react'
import { cn } from '@/utils/classNames'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

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
        'bg-white border-t border-neutral-200 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="primary" dot>{itemsCount}</Badge>
          <span className="text-sm text-neutral-500 font-medium">artículos</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Total</p>
          <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCOP(total)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {action}
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 h-12 text-base font-semibold"
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
