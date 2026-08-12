import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/classNames'

interface InventoryToolbarProps {
  onRefresh: () => void
  isLoading: boolean
  total: number
}

export function InventoryToolbar({ onRefresh, isLoading, total }: InventoryToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Inventario</h1>
        <p className="text-sm text-neutral-500 mt-1">{total} productos</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
        </Button>
      </div>
    </div>
  )
}
