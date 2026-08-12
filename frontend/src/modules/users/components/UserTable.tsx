import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { User } from '../types/user'
import { Eye, Pencil, Power } from 'lucide-react'

interface UserTableProps {
  data: User[]
  isLoading: boolean
  onView: (user: User) => void
  onEdit: (user: User) => void
  onToggleState: (user: User) => void
}

export function UserTable({ data, isLoading, onView, onEdit, onToggleState }: UserTableProps) {
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
      render: (item: User) => <span className="font-medium text-neutral-900">{item.nombre}</span>,
    },
    {
      key: 'username',
      header: 'Usuario',
      render: (item: User) => <span className="text-sm text-neutral-900">{item.username}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: User) => <span className="text-sm text-neutral-900">{item.email || '—'}</span>,
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (item: User) => <span className="text-sm text-neutral-900">{item.telefono || '—'}</span>,
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (item: User) => (
        <div className="flex flex-wrap gap-1">
          {item.roles.map(r => (
            <Badge key={r.id} variant="default">{r.nombre}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: User) => (
        <Badge variant={item.estado === 'activo' ? 'success' : 'error'}>
          {item.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-32',
      render: (item: User) => (
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
        </div>
      ),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="No hay usuarios"
    />
  )
}
