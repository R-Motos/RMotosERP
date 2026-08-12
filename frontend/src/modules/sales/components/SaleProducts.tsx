import { Table } from '@/components/ui/Table'
import { SaleProductRow } from './SaleProductRow'
import type { VentaDetalle } from '../types/sale'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface SaleProductsProps {
  detalles: VentaDetalle[]
}

export function SaleProducts({ detalles }: SaleProductsProps) {
  const columns = [
    {
      key: 'producto',
      header: 'Producto',
      render: (item: VentaDetalle) => <SaleProductRow item={item} />,
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      className: 'w-24 text-right',
      render: (item: VentaDetalle) => (
        <span className="text-sm text-neutral-900">{Number(item.cantidad)}</span>
      ),
    },
    {
      key: 'precio_unitario',
      header: 'Precio unitario',
      className: 'w-32 text-right',
      render: (item: VentaDetalle) => (
        <span className="text-sm text-neutral-900">{formatCOP(Number(item.precio_unitario))}</span>
      ),
    },
    {
      key: 'descuento',
      header: 'Descuento',
      className: 'w-24 text-right',
      render: (item: VentaDetalle) => (
        <span className="text-sm text-neutral-900">{formatCOP(Number(item.descuento))}</span>
      ),
    },
    {
      key: 'subtotal',
      header: 'Subtotal',
      className: 'w-32 text-right',
      render: (item: VentaDetalle) => (
        <span className="text-sm font-semibold text-neutral-900">{formatCOP(Number(item.subtotal))}</span>
      ),
    },
  ]

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900">Productos</h2>
      </div>
      <Table
        data={detalles}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No hay productos en esta venta"
      />
    </div>
  )
}
