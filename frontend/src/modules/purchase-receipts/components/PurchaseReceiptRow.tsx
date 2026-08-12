import type { DetalleItem } from '../types/purchase-receipt'

interface PurchaseReceiptRowProps {
  item: DetalleItem
  onCantidadChange: (producto_id: number, value: number) => void
  disabled?: boolean
}

export function PurchaseReceiptRow({ item, onCantidadChange, disabled }: PurchaseReceiptRowProps) {
  const pendiente = item.cantidad_solicitada - item.cantidad_recibida
  const isFullyReceived = pendiente <= 0

  return (
    <div className={`flex items-center gap-4 py-3 border-b border-neutral-100 last:border-b-0 ${isFullyReceived ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">{item.producto_nombre || `Producto #${item.producto_id}`}</p>
        <p className="text-xs text-neutral-500">ID: {item.producto_id}</p>
      </div>
      <div className="text-right w-24">
        <p className="text-xs text-neutral-500">Solicitado</p>
        <p className="text-sm text-neutral-900">{item.cantidad_solicitada.toFixed(2)}</p>
      </div>
      <div className="text-right w-24">
        <p className="text-xs text-neutral-500">Recibido</p>
        <p className="text-sm text-neutral-900">{item.cantidad_recibida.toFixed(2)}</p>
      </div>
      <div className="text-right w-24">
        <p className="text-xs text-neutral-500">Pendiente</p>
        <p className={`text-sm font-medium ${isFullyReceived ? 'text-success-600' : 'text-warning-600'}`}>
          {Math.max(0, pendiente).toFixed(2)}
        </p>
      </div>
      <div className="w-28">
        <input
          type="number"
          min="0"
          max={item.cantidad_solicitada}
          step="0.01"
          value={item.cantidad_recibida}
          onChange={e => onCantidadChange(item.producto_id, parseFloat(e.target.value) || 0)}
          disabled={disabled || isFullyReceived}
          className="w-full px-2 py-1 text-sm border border-neutral-200 rounded-lg disabled:bg-neutral-100"
        />
      </div>
      <div className="text-right w-28">
        <p className="text-xs text-neutral-500">Precio</p>
        <p className="text-sm text-neutral-900">S/ {item.precio_unitario.toFixed(2)}</p>
      </div>
      <div className="text-right w-28">
        <p className="text-xs text-neutral-500">Subtotal</p>
        <p className="text-sm font-semibold text-neutral-900">S/ {(item.cantidad_recibida * item.precio_unitario).toFixed(2)}</p>
      </div>
    </div>
  )
}
