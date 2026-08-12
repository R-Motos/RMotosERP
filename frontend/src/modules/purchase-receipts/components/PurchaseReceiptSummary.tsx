interface PurchaseReceiptSummaryProps {
  totalProductos: number
  productosRecibidos: number
  productosPendientes: number
  cantidadTotalRecibida: number
  valorRecepcion: number
}

export function PurchaseReceiptSummary({
  totalProductos: _totalProductos,
  productosRecibidos,
  productosPendientes,
  cantidadTotalRecibida,
  valorRecepcion,
}: PurchaseReceiptSummaryProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-neutral-900">Resumen de recepción</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-neutral-500">Productos recibidos</p>
          <p className="text-lg font-semibold text-success-600">{productosRecibidos}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Productos pendientes</p>
          <p className="text-lg font-semibold text-warning-600">{productosPendientes}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Cantidad total</p>
          <p className="text-lg font-semibold text-neutral-900">{cantidadTotalRecibida.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Valor recepción</p>
          <p className="text-lg font-semibold text-neutral-900">S/ {valorRecepcion.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
