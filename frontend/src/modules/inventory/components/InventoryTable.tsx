import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { InventoryStatusBadge } from './InventoryStatusBadge'
import { cn } from '@/utils/classNames'
import type { Producto } from '../types/inventory'

interface InventoryTableProps {
  data: Producto[]
  isLoading: boolean
  onRowClick: (product: Producto) => void
}

export function InventoryTable({ data, isLoading, onRowClick }: InventoryTableProps) {
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
      key: 'nombre',
      header: 'Producto',
      render: (item: Producto) => (
        <div>
          <p className="font-medium text-neutral-900">{item.nombre}</p>
          <p className="text-xs text-neutral-500">{item.sku || 'Sin SKU'}</p>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (item: Producto) => item.categorias?.[0]?.nombre || '-',
    },
    {
      key: 'marca',
      header: 'Marca',
      render: (item: Producto) => item.marca?.nombre || '-',
    },
    {
      key: 'stock_actual',
      header: 'Stock actual',
      render: (item: Producto) => (
        <span className={cn(
          'font-semibold',
          item.cantidad_disponible <= item.stock_minimo && item.cantidad_disponible > 0 ? 'text-warning-600' : '',
          item.cantidad_disponible <= 0 ? 'text-error-600' : ''
        )}>
          {item.cantidad_disponible}
        </span>
      ),
    },
    {
      key: 'stock_minimo',
      header: 'Stock mínimo',
      render: (item: Producto) => (
        <span className="text-sm text-neutral-900">{item.stock_minimo}</span>
      ),
    },
    {
      key: 'estado_visual',
      header: 'Estado',
      render: (item: Producto) => {
        const estado = item.cantidad_disponible <= 0 ? 'sin_stock' : item.cantidad_disponible <= item.stock_minimo ? 'bajo' : 'normal'
        return <InventoryStatusBadge estado={estado} />
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (item: Producto) => (
        <Button variant="ghost" size="sm" onClick={() => onRowClick(item)}>
          Ver
        </Button>
      ),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="No hay productos en inventario"
    />
  )
}
