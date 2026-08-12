interface SaleInfoProps {
  numero: string
  fechaVenta: string
  estado: string
  clienteNombre?: string
  usuarioNombre?: string
  metodoPago: string
  observaciones?: string | null
}

export function SaleInfo({
  numero,
  fechaVenta,
  estado,
  clienteNombre,
  usuarioNombre,
  metodoPago,
  observaciones,
}: SaleInfoProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
      <h2 className="text-sm font-semibold text-neutral-900 mb-3">Información de la venta</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-neutral-500">Número</p>
          <p className="text-sm font-medium text-neutral-900">{numero}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Fecha</p>
          <p className="text-sm font-medium text-neutral-900">{new Date(fechaVenta).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Cliente</p>
          <p className="text-sm font-medium text-neutral-900">{clienteNombre || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Usuario</p>
          <p className="text-sm font-medium text-neutral-900">{usuarioNombre || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Método de pago</p>
          <p className="text-sm font-medium text-neutral-900">{metodoPago}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Estado</p>
          <p className="text-sm font-medium text-neutral-900">{estado}</p>
        </div>
        {observaciones && (
          <div className="sm:col-span-2">
            <p className="text-xs text-neutral-500">Observaciones</p>
            <p className="text-sm text-neutral-700">{observaciones}</p>
          </div>
        )}
      </div>
    </div>
  )
}
