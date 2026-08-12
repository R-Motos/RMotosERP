import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { ClientStatusBadge } from './ClientStatusBadge'
import type { Cliente } from '../types/client'

interface ClientTableProps {
  data: Cliente[]
  isLoading: boolean
  onEdit: (client: Cliente) => void
  onToggleState: (client: Cliente) => void
}

export function ClientTable({ data, isLoading, onEdit, onToggleState }: ClientTableProps) {
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
      header: 'Cliente',
      render: (item: Cliente) => (
        <div>
          <p className="font-medium text-neutral-900">{item.nombre}</p>
          <p className="text-xs text-neutral-500">{item.email || item.telefono || 'Sin contacto'}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: Cliente) => item.email || '-',
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (item: Cliente) => item.telefono || '-',
    },
    {
      key: 'cantidad_compras',
      header: 'Compras',
      render: (item: Cliente) => item.cantidad_compras,
    },
    {
      key: 'total_gastado',
      header: 'Total gastado',
      render: (item: Cliente) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(item.total_gastado),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: Cliente) => <ClientStatusBadge estado={item.estado} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (item: Cliente) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onToggleState(item)}>
            {item.estado === 'activo' ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="No hay clientes"
    />
  )
}
