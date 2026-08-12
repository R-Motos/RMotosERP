import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { AuditActionBadge } from './AuditActionBadge'
import type { AuditLog } from '../types/audit'

interface AuditTableProps {
  data: AuditLog[]
  isLoading: boolean
  onRowClick: (log: AuditLog) => void
}

export function AuditTable({ data, isLoading, onRowClick }: AuditTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const columns = [
    {
      key: 'created_at',
      header: 'Fecha',
      className: 'w-40',
      render: (item: AuditLog) => (
        <span className="text-sm text-neutral-600 whitespace-nowrap">
          {new Date(item.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'usuario_id',
      header: 'Usuario',
      className: 'w-24',
      render: (item: AuditLog) => (
        <span className="text-sm text-neutral-600">#{item.usuario_id}</span>
      ),
    },
    {
      key: 'accion',
      header: 'Acción',
      className: 'w-28',
      render: (item: AuditLog) => <AuditActionBadge accion={item.accion} />,
    },
    {
      key: 'modulo',
      header: 'Módulo',
      className: 'w-32',
      render: (item: AuditLog) => (
        <span className="text-sm text-neutral-600">{item.modulo}</span>
      ),
    },
    {
      key: 'registro_id',
      header: 'Registro',
      className: 'w-24',
      render: (item: AuditLog) => (
        <span className="text-sm text-neutral-600">#{item.registro_id}</span>
      ),
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (item: AuditLog) => (
        <span className="text-sm text-neutral-900 truncate block max-w-md">{item.descripcion}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (item: AuditLog) => (
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
      emptyMessage="No hay registros de auditoría"
    />
  )
}
