import { Button } from '@/components/ui/Button'

interface SaleActionsProps {
  onCancel: () => void
  onBack: () => void
  canCancel: boolean
  isCancelling: boolean
}

export function SaleActions({ onCancel, onBack, canCancel, isCancelling }: SaleActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={onBack}>
        Volver
      </Button>
      {canCancel && (
        <Button variant="secondary" size="sm" onClick={onCancel} loading={isCancelling}>
          Anular venta
        </Button>
      )}
    </div>
  )
}
