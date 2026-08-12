import type { OrdenCompraDetalle } from '../types/purchase-order'

interface PurchaseOrderProductRowProps {
  item: OrdenCompraDetalle
}

export function PurchaseOrderProductRow({ item }: PurchaseOrderProductRowProps) {
  return (
    <div>
      <p className="text-sm font-medium text-neutral-900">{item.producto_nombre || `Producto #${item.producto_id}`}</p>
      <p className="text-xs text-neutral-500">ID: {item.producto_id}</p>
    </div>
  )
}
