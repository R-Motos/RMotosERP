import { UserPlus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/classNames'

interface ClientToolbarProps {
  onRefresh: () => void
  onCreate: () => void
  isLoading: boolean
  total: number
}

export function ClientToolbar({ onRefresh, onCreate, isLoading, total }: ClientToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Clientes</h1>
        <p className="text-sm text-neutral-500 mt-1">{total} clientes</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
        </Button>
        <Button variant="primary" size="sm" onClick={onCreate}>
          <UserPlus size={16} />
          Nuevo cliente
        </Button>
      </div>
    </div>
  )
}
