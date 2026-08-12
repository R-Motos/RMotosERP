import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Cupon } from '../types/coupon'
import { Eye, Pencil, Power, Trash2 } from 'lucide-react'

interface CouponTableProps {
  data: Cupon[]
  isLoading: boolean
  onView: (coupon: Cupon) => void
  onEdit: (coupon: Cupon) => void
  onToggleState: (coupon: Cupon) => void
  onDelete: (coupon: Cupon) => void
}

export function CouponTable({ data, isLoading, onView, onEdit, onToggleState, onDelete }: CouponTableProps) {
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
      key: 'codigo',
      header: 'Código',
      render: (item: Cupon) => <span className="font-mono font-medium text-neutral-900">{item.codigo}</span>,
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (item: Cupon) => (
        <Badge variant={item.tipo === 'porcentaje' ? 'default' : 'default'}>
          {item.tipo === 'porcentaje' ? 'Porcentaje' : 'Valor fijo'}
        </Badge>
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      render: (item: Cupon) => (
        <span className="text-sm text-neutral-900">
          {item.tipo === 'porcentaje' ? `${item.valor}%` : `S/ ${Number(item.valor).toFixed(2)}`}
        </span>
      ),
    },
    {
      key: 'fecha_fin',
      header: 'Vencimiento',
      render: (item: Cupon) => <span className="text-sm text-neutral-900">{new Date(item.fecha_fin).toLocaleDateString('es-PE')}</span>,
    },
    {
      key: 'usos',
      header: 'Usos',
      render: (item: Cupon) => (
        <span className="text-sm text-neutral-900">
          {item.usos_realizados} / {item.uso_maximo}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: Cupon) => (
        <Badge variant={item.estado === 'activo' ? 'success' : 'error'}>
          {item.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-32',
      render: (item: Cupon) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(item)} title="Ver">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)} title="Editar">
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onToggleState(item)} title={item.estado === 'activo' ? 'Desactivar' : 'Activar'}>
            <Power size={16} className={item.estado === 'activo' ? 'text-error-600' : 'text-success-600'} />
          </Button>
          {item.estado === 'inactivo' && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(item)} title="Eliminar">
              <Trash2 size={16} className="text-neutral-500 hover:text-error-600" />
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
      emptyMessage="No hay cupones"
    />
  )
}
