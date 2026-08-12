import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface DeleteProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
  isLoading: boolean
}

export function DeleteProductDialog({ isOpen, onClose, onConfirm, productName, isLoading }: DeleteProductDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar producto" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          ¿Estás seguro de eliminar el producto <strong>"{productName}"</strong>?
        </p>
        <p className="text-xs text-neutral-400">Esta acción no se puede deshacer.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
