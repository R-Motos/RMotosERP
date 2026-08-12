import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import type { Categoria } from '../types/category'

interface CategoryTableProps {
  data: Categoria[]
  isLoading: boolean
  onEdit: (category: Categoria) => void
  onDelete: (category: Categoria) => void
}

export function CategoryTable({ data, isLoading, onEdit, onDelete }: CategoryTableProps) {
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
      render: (item: Categoria) => <span className="font-medium text-neutral-900">{item.nombre}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (item: Categoria) => (
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
      emptyMessage="No hay categorías"
    />
  )
}
