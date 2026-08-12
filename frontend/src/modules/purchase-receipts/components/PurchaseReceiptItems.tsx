import { PurchaseReceiptRow } from './PurchaseReceiptRow'
import type { DetalleItem } from '../types/purchase-receipt'

interface PurchaseReceiptItemsProps {
  detalles: DetalleItem[]
  onCantidadChange: (producto_id: number, value: number) => void
  disabled?: boolean
}

export function PurchaseReceiptItems({ detalles, onCantidadChange, disabled }: PurchaseReceiptItemsProps) {
  if (detalles.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        No hay productos para recibir
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Producto</p>
          </div>
          <div className="text-right w-24">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Solicitado</p>
          </div>
          <div className="text-right w-24">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Recibido</p>
          </div>
          <div className="text-right w-24">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Pendiente</p>
          </div>
          <div className="w-28">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Cant. a recibir</p>
          </div>
          <div className="text-right w-28">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Precio</p>
          </div>
          <div className="text-right w-28">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Subtotal</p>
          </div>
        </div>
      </div>
      <div className="px-4">
        {detalles.map(item => (
          <PurchaseReceiptRow
            key={item.id}
            item={item}
            onCantidadChange={onCantidadChange}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
