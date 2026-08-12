import { Button } from '@/components/ui/Button'

interface PurchaseOrderActionsProps {
  onEdit: () => void
  onCancel: () => void
  onPrint: () => void
  canEdit: boolean
  canCancel: boolean
  isCancelling: boolean
  isEditing: boolean
}

export function PurchaseOrderActions({
  onEdit,
  onCancel,
  onPrint,
  canEdit,
  canCancel,
  isCancelling,
  isEditing,
}: PurchaseOrderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={onPrint} disabled={isEditing || isCancelling}>
        Imprimir
      </Button>
      {canCancel && (
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={isEditing || isCancelling} loading={isCancelling}>
          Cancelar
        </Button>
      )}
      {canEdit && (
        <Button variant="primary" size="sm" onClick={onEdit} disabled={isEditing || isCancelling} loading={isEditing}>
          Editar
        </Button>
      )}
    </div>
  )
}
