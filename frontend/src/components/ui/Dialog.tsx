import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

/**
 * Dialog - Diálogo de confirmación simple.
 * 
 * @prop isOpen - Control de visibilidad
 * @prop onClose - Callback de cierre
 * @prop onConfirm - Callback de confirmación
 * @prop title - Título
 * @prop description - Descripción
 * @prop confirmLabel - Texto botón confirmar
 * @prop cancelLabel - Texto botón cancelar
 * @prop variant - default | danger
 * @prop loading - Estado de carga
 */
interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  loading?: boolean
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  loading = false,
}: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-neutral-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-neutral-500 mb-6">{description}</p>
          )}
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              loading={loading}
              className="flex-1"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
