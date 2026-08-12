import { Button } from '@/components/ui/Button'

interface PurchaseReceiptConfirmProps {
  onSubmit: () => void
  onCancel: () => void
  isLoading: boolean
  disabled: boolean
}

export function PurchaseReceiptConfirm({ onSubmit, onCancel, isLoading, disabled }: PurchaseReceiptConfirmProps) {
  return (
    <div className="flex gap-2 justify-end pt-4">
      <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={onSubmit} loading={isLoading} disabled={disabled}>
        Confirmar recepción
      </Button>
    </div>
  )
}
