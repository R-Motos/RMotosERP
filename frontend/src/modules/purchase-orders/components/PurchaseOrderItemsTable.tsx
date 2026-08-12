import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PurchaseOrderItemsTableProps {
  detalles: Array<{ producto_id: number; cantidad: number; precio_unitario: number; subtotal: number; producto_nombre?: string }>
  onUpdateDetalle: (index: number, field: 'cantidad' | 'precio_unitario', value: number) => void
  onRemoveDetalle: (index: number) => void
  disabled?: boolean
}

export function PurchaseOrderItemsTable({ detalles, onUpdateDetalle, onRemoveDetalle, disabled }: PurchaseOrderItemsTableProps) {
  if (detalles.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        No hay productos agregados
      </div>
    )
  }

  const columns: {
    key: string
    header: string
    render?: (item: { producto_id: number; cantidad: number; precio_unitario: number; subtotal: number; producto_nombre?: string }) => React.ReactNode
    className?: string
  }[] = [
    {
      key: 'producto',
      header: 'Producto',
      render: (item) => (
        <span className="font-medium text-neutral-900">{item.producto_nombre || `Producto #${item.producto_id}`}</span>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      className: 'w-24',
      render: (item) => {
        const index = detalles.indexOf(item)
        return (
          <input
            type="number"
            min="1"
            step="1"
            value={item.cantidad}
            onChange={e => onUpdateDetalle(index, 'cantidad', parseFloat(e.target.value) || 0)}
            disabled={disabled}
            className="w-full px-2 py-1 text-sm border border-neutral-200 rounded-lg disabled:bg-neutral-100"
          />
        )
      },
    },
    {
      key: 'precio_unitario',
      header: 'Precio unitario',
      className: 'w-32',
      render: (item) => {
        const index = detalles.indexOf(item)
        return (
          <input
            type="number"
            min="0"
            step="1"
            value={item.precio_unitario}
            onChange={e => onUpdateDetalle(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
            disabled={disabled}
            className="w-full px-2 py-1 text-sm border border-neutral-200 rounded-lg disabled:bg-neutral-100"
          />
        )
      },
    },
    {
      key: 'subtotal',
      header: 'Subtotal',
      render: (item) => (
        <span className="font-medium text-neutral-900">
          {formatCOP(Number(item.subtotal))}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      render: (item) => {
        const index = detalles.indexOf(item)
        return (
          <Button variant="ghost" size="sm" onClick={() => onRemoveDetalle(index)} disabled={disabled}>
            <Trash2 size={16} className="text-error-600" />
          </Button>
        )
      },
    },
  ]

  return (
    <Table
      data={detalles}
      columns={columns}
      keyExtractor={(_, index) => index}
      emptyMessage="No hay productos"
    />
  )
}
