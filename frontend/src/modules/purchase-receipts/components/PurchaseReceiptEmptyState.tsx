import { EmptyState } from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'

interface PurchaseReceiptEmptyStateProps {
  onBack: () => void
}

export function PurchaseReceiptEmptyState({ onBack }: PurchaseReceiptEmptyStateProps) {
  return (
    <EmptyState
      icon={<Package size={32} />}
      title="Sin productos para recibir"
      description="Esta orden no tiene productos pendientes de recepción"
      action={
        <button onClick={onBack} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Volver a la orden
        </button>
      }
    />
  )
}
