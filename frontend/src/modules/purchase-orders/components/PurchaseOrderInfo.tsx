interface PurchaseOrderInfoProps {
  proveedorNombre?: string
  usuarioNombre?: string
  observaciones?: string | null
  createdAt: string
  updatedAt: string
}

export function PurchaseOrderInfo({
  proveedorNombre,
  usuarioNombre,
  observaciones,
  createdAt,
  updatedAt,
}: PurchaseOrderInfoProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
      <h2 className="text-sm font-semibold text-neutral-900 mb-3">Información de la orden</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-neutral-500">Proveedor</p>
          <p className="text-sm font-medium text-neutral-900">{proveedorNombre || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Usuario</p>
          <p className="text-sm font-medium text-neutral-900">{usuarioNombre || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Fecha de creación</p>
          <p className="text-sm font-medium text-neutral-900">{new Date(createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Última actualización</p>
          <p className="text-sm font-medium text-neutral-900">{new Date(updatedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
