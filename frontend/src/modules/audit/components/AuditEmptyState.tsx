import { EmptyState } from '@/components/ui/EmptyState'
import { FileText } from 'lucide-react'

interface AuditEmptyStateProps {
  hasFilters: boolean
  onClear: () => void
}

export function AuditEmptyState({ hasFilters, onClear }: AuditEmptyStateProps) {
  return (
    <EmptyState
      icon={<FileText size={32} />}
      title="Sin registros de auditoría"
      description={hasFilters ? "No se encontraron registros con los filtros aplicados" : "No hay registros de auditoría disponibles"}
      action={
        hasFilters ? (
          <button onClick={onClear} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Limpiar filtros
          </button>
        ) : undefined
      }
    />
  )
}
