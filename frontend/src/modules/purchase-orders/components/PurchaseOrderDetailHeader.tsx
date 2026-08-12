import { ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PurchaseOrderStatusBadge } from './PurchaseOrderStatusBadge'
import type { OrdenCompraEstado } from '../types/purchase-order'

interface PurchaseOrderDetailHeaderProps {
  numero: string
  estado: OrdenCompraEstado
  onBack: () => void
  onEdit: () => void
  onCancel: () => void
  onPrint: () => void
  onReceive: () => void
  canEdit: boolean
  canCancel: boolean
  canReceive: boolean
  isCancelling: boolean
  isEditing: boolean
}

export function PurchaseOrderDetailHeader({
  numero,
  estado,
  onBack,
  onEdit,
  onCancel,
  onPrint,
  onReceive,
  canEdit,
  canCancel,
  canReceive,
  isCancelling,
  isEditing,
}: PurchaseOrderDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Orden de Compra</h1>
          <p className="text-sm text-neutral-500 mt-1">N° {numero}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PurchaseOrderStatusBadge estado={estado} />
        {canReceive && (
          <Button variant="primary" size="sm" onClick={onReceive} disabled={isEditing || isCancelling}>
            <Package size={16} />
            Recibir Compra
          </Button>
        )}
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
    </div>
  )
}
