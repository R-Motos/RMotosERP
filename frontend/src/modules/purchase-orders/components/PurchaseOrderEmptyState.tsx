import { EmptyState } from '@/components/ui/EmptyState'
import { ShoppingCart } from 'lucide-react'

interface PurchaseOrderEmptyStateProps {
  onCreate: () => void
}

export function PurchaseOrderEmptyState({ onCreate }: PurchaseOrderEmptyStateProps) {
  return (
    <EmptyState
      icon={<ShoppingCart size={32} />}
      title="Sin órdenes de compra"
      description="No se encontraron órdenes de compra con los filtros aplicados"
      action={
        <button onClick={onCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Crear primera orden
        </button>
      }
    />
  )
}
