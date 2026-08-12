import { useState, useCallback, useEffect, useMemo } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { TagToolbar } from '@/modules/tags/components/TagToolbar'
import { TagFilters } from '@/modules/tags/components/TagFilters'
import { TagTable } from '@/modules/tags/components/TagTable'
import { TagForm } from '@/modules/tags/components/TagForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tag } from 'lucide-react'
import { useTags } from '@/modules/tags/hooks/useTags'
import { useTagForm } from '@/modules/tags/hooks/useTags'
import { tagService } from '@/modules/tags/services/tag.service'
import type { Etiqueta, EtiquetaFilter } from '@/modules/tags/types/tag'

export function TagList() {
  const { addToast } = useToast()

  const { tags, isLoading, error, executeFetch } = useTags()
  const { filters, setFilters, handleClear, hasActiveFilters } = useTagFilters()
  const form = useTagForm(() => executeFetch(filters))

  const [deleteTarget, setDeleteTarget] = useState<Etiqueta | null>(null)

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await tagService.delete(deleteTarget.id)
      addToast({ type: 'success', message: 'Etiqueta eliminada' })
      setDeleteTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al eliminar la etiqueta' })
    }
  }, [deleteTarget, filters, executeFetch, addToast])

  useEffect(() => {
    executeFetch(filters)
  }, [filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFiltersChange = useCallback((newFilters: Partial<EtiquetaFilter>) => {
    setFilters({ ...filters, ...newFilters })
  }, [filters, setFilters])

  const filteredTags = useMemo(() => {
    if (!filters.q) return tags
    const term = filters.q.toLowerCase()
    return tags.filter(t => t.nombre.toLowerCase().includes(term))
  }, [tags, filters.q])

  return (
    <div className="p-4 md:p-6">
      <TagToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={tags.length}
      />

      <TagFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.q && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Búsqueda: {filters.q}</span>
          )}
          <button onClick={handleClear} className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
            Limpiar
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={() => executeFetch(filters)} className="text-sm text-primary-600 hover:text-primary-700 mt-1">
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : filteredTags.length === 0 ? (
        <EmptyState
          icon={<Tag size={32} />}
          title="Sin etiquetas"
          description="No se encontraron etiquetas con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primera etiqueta
            </button>
          }
        />
      ) : (
        <TagTable
          data={filteredTags}
          isLoading={isLoading}
          onEdit={form.openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar etiqueta"
        description={
          deleteTarget
            ? `¿Estás seguro de que deseas eliminar "${deleteTarget.nombre}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.editingTag ? 'Editar etiqueta' : 'Nueva etiqueta'}
        size="md"
      >
        <TagForm
          tag={form.editingTag}
          onSubmit={form.submit}
          onCancel={form.close}
          isLoading={form.isLoading}
        />
      </Modal>
    </div>
  )
}

function useTagFilters() {
  const [filters, setFilters] = useState<EtiquetaFilter>({})
  const handleClear = useCallback(() => {
    setFilters({})
  }, [])
  const hasActiveFilters = !!filters.q

  return { filters, setFilters, handleClear, hasActiveFilters }
}
