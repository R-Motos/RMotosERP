import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProductImage } from './ProductImage'
import { ProductStatusBadge } from './ProductStatusBadge'
import type { Producto } from '../types/product'
import { cn } from '@/utils/classNames'
import { Eye, Pencil, Power } from 'lucide-react'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ProductTableProps {
  data: Producto[]
  isLoading: boolean
  onView?: (product: Producto) => void
  onEdit?: (product: Producto) => void
  onToggleState?: (product: Producto) => void
  readOnly?: boolean
}

export function ProductTable({ data, isLoading, onView, onEdit, onToggleState, readOnly }: ProductTableProps) {
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
      key: 'imagen',
      header: '',
      className: 'w-12',
      render: (item: Producto) => <ProductImage src={item.imagen} name={item.nombre} />,
    },
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
      key: 'marca',
      header: 'Marca',
      render: (item: Producto) => item.marca?.nombre || '-',
    },
    {
      key: 'precio_venta',
      header: 'Precio venta',
      render: (item: Producto) => formatCOP(item.precio_venta),
    },
    {
      key: 'cantidad_disponible',
      header: 'Stock',
      render: (item: Producto) => (
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold',
            item.cantidad_disponible <= item.stock_minimo && item.cantidad_disponible > 0 ? 'text-warning-600' : '',
            item.cantidad_disponible <= 0 ? 'text-error-600' : ''
          )}>
            {item.cantidad_disponible}
          </span>
          {item.cantidad_disponible <= item.stock_minimo && item.cantidad_disponible > 0 && (
            <Badge variant="warning" size="sm">Bajo</Badge>
          )}
          {item.cantidad_disponible <= 0 && (
            <Badge variant="error" size="sm">Agotado</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: Producto) => <ProductStatusBadge estado={item.estado} />,
    },
    ...(readOnly ? [] : [
      {
        key: 'actions',
        header: '',
        className: 'w-32',
        render: (item: Producto) => (
          <div className="flex items-center gap-1">
            {onView && (
              <Button variant="ghost" size="sm" onClick={() => onView(item)} title="Ver">
                <Eye size={16} />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)} title="Editar">
                <Pencil size={16} />
              </Button>
            )}
            {onToggleState && (
              <Button variant="ghost" size="sm" onClick={() => onToggleState(item)} title={item.estado === 'publicado' ? 'Desactivar' : 'Activar'}>
                <Power size={16} className={item.estado === 'publicado' ? 'text-error-600' : 'text-success-600'} />
              </Button>
            )}
          </div>
        ),
      },
    ]),
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="No hay productos"
    />
  )
}
