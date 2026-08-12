import { useState, useCallback, useEffect } from 'react'
import { Pagination } from '@/components/ui/Pagination'
import { AuditToolbar } from '@/modules/audit/components/AuditToolbar'
import { AuditFilters } from '@/modules/audit/components/AuditFilters'
import { AuditTable } from '@/modules/audit/components/AuditTable'
import { AuditDetailModal } from '@/modules/audit/components/AuditDetailModal'
import { AuditEmptyState } from '@/modules/audit/components/AuditEmptyState'
import { useAudit } from '@/modules/audit/hooks/useAudit'
import { useAuditFilters } from '@/modules/audit/hooks/useAuditFilters'
import type { AuditLog } from '@/modules/audit/types/audit'

export function AuditList() {
  const { logs, total, page, size, isLoading, error, executeFetch } = useAudit()
  const { filters, handleFilterChange, handleClear, hasActiveFilters, setPage } = useAuditFilters()

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        handleFilterChange(key as keyof typeof filters, value as any)
      }
    })
  }, [handleFilterChange])

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  useEffect(() => {
    executeFetch(filters)
  }, [filters.page, filters.size, filters.usuario_id, filters.modulo, filters.accion, filters.fecha_inicio, filters.fecha_fin])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [setPage])

  const handleRowClick = useCallback((log: AuditLog) => {
    setSelectedLog(log)
  }, [])

  const totalPages = Math.ceil(total / size)

  return (
    <div className="p-4 md:p-6">
      <AuditToolbar
        onRefresh={handleRefresh}
        isLoading={isLoading}
        total={total}
      />

      <AuditFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.modulo && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Módulo: {filters.modulo}</span>}
          {filters.accion && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Acción: {filters.accion}</span>}
          {filters.usuario_id && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Usuario: #{filters.usuario_id}</span>}
          {filters.fecha_inicio && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Desde: {filters.fecha_inicio}</span>}
          {filters.fecha_fin && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Hasta: {filters.fecha_fin}</span>}
          <button onClick={handleClear} className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">Limpiar</button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={() => executeFetch(filters)} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <AuditEmptyState hasFilters={hasActiveFilters} onClear={handleClear} />
      ) : (
        <>
          <AuditTable data={logs} isLoading={isLoading} onRowClick={handleRowClick} />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-neutral-500">
              Mostrando {logs.length} de {total} registros
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Filas por página:</span>
              <select
                value={size}
                onChange={e => handleFilterChange('size', Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-neutral-200 rounded-lg"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}

      <AuditDetailModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  )
}
