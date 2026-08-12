import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/classNames'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface SaleToolbarProps {
  onRefresh: () => void
  onCreate: () => void
  isLoading: boolean
  total: number
  cantidadVentas: number
}

export function SaleToolbar({ onRefresh, onCreate: _onCreate, isLoading, total, cantidadVentas }: SaleToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Ventas</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {cantidadVentas} venta{cantidadVentas !== 1 ? 's' : ''} - Total: {formatCOP(total)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
        </Button>
      </div>
    </div>
  )
}
