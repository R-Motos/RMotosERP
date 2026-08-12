import { memo } from 'react'
import { cn } from '@/utils/classNames'
import { Button } from '@/components/ui/Button'
import { Minus, Plus, Trash2 } from 'lucide-react'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface CartItemProps {
  name: string
  price: number
  quantity: number
  onUpdateQuantity?: (delta: number) => void
  onRemove?: () => void
  className?: string
}

export const CartItem = memo(function CartItem({ name, price, quantity, onUpdateQuantity, onRemove, className }: CartItemProps) {
  const unitPrice = typeof price === 'number' ? price : Number(price || 0)
  const lineTotal = unitPrice * quantity

  return (
    <div className={cn('flex items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0', className)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate leading-snug">{name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{formatCOP(unitPrice)} c/u</p>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity?.(-1)}
            disabled={quantity <= 1}
            className="h-9 w-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Reducir cantidad"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-sm font-semibold text-neutral-900 text-center tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity?.(1)}
            className="h-9 w-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="w-16 text-right">
          <p className="text-sm font-semibold text-neutral-900 tabular-nums">{formatCOP(lineTotal)}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 size={16} />}
          onClick={onRemove}
          aria-label="Eliminar"
          className="text-neutral-400 hover:text-error-600 hover:bg-error-50"
        />
      </div>
    </div>
  )
})
