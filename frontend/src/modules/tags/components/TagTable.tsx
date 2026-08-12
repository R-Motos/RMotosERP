import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import type { Etiqueta } from '../types/tag'

interface TagTableProps {
  data: Etiqueta[]
  isLoading: boolean
  onEdit: (tag: Etiqueta) => void
  onDelete: (tag: Etiqueta) => void
}

export function TagTable({ data, isLoading, onEdit, onDelete }: TagTableProps) {
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
      render: (item: Etiqueta) => <span className="font-medium text-neutral-900">{item.nombre}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (item: Etiqueta) => (
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
      emptyMessage="No hay etiquetas"
    />
  )
}
