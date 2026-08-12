import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { PurchaseOrderStatusBadge } from './PurchaseOrderStatusBadge'
import type { OrdenCompra } from '../types/purchase-order'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PurchaseOrderTableProps {
  data: OrdenCompra[]
  isLoading: boolean
  onEdit: (order: OrdenCompra) => void
  onRowClick?: (order: OrdenCompra) => void
}

export function PurchaseOrderTable({ data, isLoading, onEdit, onRowClick }: PurchaseOrderTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const columns = [
    {
      key: 'numero',
      header: 'Número',
      render: (item: OrdenCompra) => (
        <button
          onClick={() => onRowClick?.(item)}
          className="font-medium text-primary-600 hover:text-primary-700 text-left"
        >
          {item.numero}
        </button>
      ),
    },
    {
      key: 'proveedor',
      header: 'Proveedor',
      render: (item: OrdenCompra) => item.proveedor_nombre || `Proveedor #${item.proveedor_id}`,
    },
    {
      key: 'detalles',
      header: 'Productos',
      render: (item: OrdenCompra) => `${item.detalles.length} productos`,
    },
    {
      key: 'total',
      header: 'Total',
      render: (item: OrdenCompra) => (
        <span className="font-medium text-neutral-900">
          {formatCOP(Number(item.total))}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: OrdenCompra) => <PurchaseOrderStatusBadge estado={item.estado} />,
    },
    {
      key: 'created_at',
      header: 'Fecha',
      render: (item: OrdenCompra) => new Date(item.created_at).toLocaleDateString('es-PE'),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (item: OrdenCompra) => (
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
          Editar
        </Button>
      ),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="No hay órdenes de compra"
    />
  )
}
