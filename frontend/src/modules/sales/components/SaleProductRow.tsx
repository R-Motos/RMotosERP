import type { VentaDetalle } from '../types/sale'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface SaleProductRowProps {
  item: VentaDetalle
}

export function SaleProductRow({ item }: SaleProductRowProps) {
  return (
    <div className="flex items-center gap-3">
      {item.producto_imagen && (
        <img
          src={item.producto_imagen}
          alt={item.producto_nombre || 'Producto'}
          className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
        />
      )}
      <div>
        <p className="text-sm font-medium text-neutral-900">
          {item.producto_nombre || `Producto #${item.producto_id}`}
        </p>
        {item.producto_sku && (
          <p className="text-xs text-neutral-500">SKU: {item.producto_sku}</p>
        )}
        {item.descuento > 0 && (
          <p className="text-xs text-neutral-500">Desc: {formatCOP(Number(item.descuento))}</p>
        )}
      </div>
    </div>
  )
}
