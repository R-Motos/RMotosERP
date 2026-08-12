import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { SaleStatusBadge } from './SaleStatusBadge'
import type { Venta } from '../types/sale'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface SaleTableProps {
  data: Venta[]
  isLoading: boolean
  onRowClick: (sale: Venta) => void
  onCancel: (sale: Venta) => void
}

export function SaleTable({ data, isLoading, onRowClick, onCancel }: SaleTableProps) {
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
      render: (item: Venta) => (
        <button
          onClick={() => onRowClick(item)}
          className="font-medium text-primary-600 hover:text-primary-700 text-left"
        >
          {item.numero}
        </button>
      ),
    },
    {
      key: 'fecha_venta',
      header: 'Fecha',
      render: (item: Venta) => new Date(item.fecha_venta).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (item: Venta) => item.cliente_nombre || (item.cliente_id ? `Cliente #${item.cliente_id}` : '-'),
    },
    {
      key: 'metodo_pago',
      header: 'Método de pago',
      render: (item: Venta) => item.metodo_pago,
    },
    {
      key: 'total',
      header: 'Total',
      render: (item: Venta) => (
        <span className="font-medium text-neutral-900">{formatCOP(Number(item.total))}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: Venta) => <SaleStatusBadge estado={item.estado} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (item: Venta) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onRowClick(item)}>
            Ver
          </Button>
          {item.estado !== 'anulada' && (
            <Button variant="ghost" size="sm" onClick={() => onCancel(item)}>
              Anular
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="No hay ventas"
    />
  )
}
