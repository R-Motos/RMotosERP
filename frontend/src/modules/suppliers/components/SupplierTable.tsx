import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { SupplierStatusBadge } from './SupplierStatusBadge'
import type { Proveedor } from '../types/supplier'

interface SupplierTableProps {
  data: Proveedor[]
  isLoading: boolean
  onEdit: (supplier: Proveedor) => void
  onToggleState: (supplier: Proveedor) => void
}

export function SupplierTable({ data, isLoading, onEdit, onToggleState }: SupplierTableProps) {
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
      header: 'Proveedor',
      render: (item: Proveedor) => (
        <div>
          <p className="font-medium text-neutral-900">{item.nombre}</p>
          <p className="text-xs text-neutral-500">{item.nit || 'Sin NIT'}</p>
        </div>
      ),
    },
    {
      key: 'contacto',
      header: 'Contacto',
      render: (item: Proveedor) => item.contacto || '-',
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (item: Proveedor) => item.telefono || '-',
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: Proveedor) => item.email || '-',
    },
    {
      key: 'ciudad',
      header: 'Ciudad',
      render: (item: Proveedor) => item.ciudad || '-',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: Proveedor) => <SupplierStatusBadge estado={item.estado} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (item: Proveedor) => (
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
      emptyMessage="No hay proveedores"
    />
  )
}
