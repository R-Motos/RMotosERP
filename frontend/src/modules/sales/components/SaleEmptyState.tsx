import { EmptyState } from '@/components/ui/EmptyState'
import { ShoppingCart } from 'lucide-react'

interface SaleEmptyStateProps {
  onCreate: () => void
}

export function SaleEmptyState({ onCreate }: SaleEmptyStateProps) {
  return (
    <EmptyState
      icon={<ShoppingCart size={32} />}
      title="Sin ventas"
      description="No se encontraron ventas con los filtros aplicados"
      action={
        <button onClick={onCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Ir al POS
        </button>
      }
    />
  )
}
