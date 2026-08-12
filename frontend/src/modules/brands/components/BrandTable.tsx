import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import type { Marca } from '../types/brand'

interface BrandTableProps {
  data: Marca[]
  isLoading: boolean
  onEdit: (brand: Marca) => void
  onDelete: (brand: Marca) => void
}

export function BrandTable({ data, isLoading, onEdit, onDelete }: BrandTableProps) {
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
      header: 'Nombre',
      render: (item: Marca) => <span className="font-medium text-neutral-900">{item.nombre}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (item: Marca) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
            Eliminar
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
      emptyMessage="No hay marcas"
    />
  )
}
