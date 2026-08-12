import { EmptyState } from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'

interface InventoryEmptyStateProps {
  onCreate: () => void
}

export function InventoryEmptyState({ onCreate }: InventoryEmptyStateProps) {
  return (
    <EmptyState
      icon={<Package size={32} />}
      title="Sin productos en inventario"
      description="No se encontraron productos con los filtros aplicados"
      action={
        <button onClick={onCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Ir a productos
        </button>
      }
    />
  )
}
