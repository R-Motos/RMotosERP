import { useState, useCallback, useEffect, useMemo } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { CategoryToolbar } from '@/modules/categories/components/CategoryToolbar'
import { CategoryFilters } from '@/modules/categories/components/CategoryFilters'
import { CategoryTable } from '@/modules/categories/components/CategoryTable'
import { CategoryForm } from '@/modules/categories/components/CategoryForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { FolderOpen } from 'lucide-react'
import { useCategories } from '@/modules/categories/hooks/useCategories'
import { useCategoryForm } from '@/modules/categories/hooks/useCategories'
import { categoryService } from '@/modules/categories/services/category.service'
import type { Categoria, CategoriaFilter } from '@/modules/categories/types/category'

export function CategoryList() {
  const { addToast } = useToast()

  const { categories, isLoading, error, executeFetch } = useCategories()
  const { filters, setFilters, handleClear, hasActiveFilters } = useCategoryFilters()
  const form = useCategoryForm(() => executeFetch(filters))

  const [deleteTarget, setDeleteTarget] = useState<Categoria | null>(null)

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await categoryService.delete(deleteTarget.id)
      addToast({ type: 'success', message: 'Categoría eliminada' })
      setDeleteTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al eliminar la categoría' })
    }
  }, [deleteTarget, filters, executeFetch, addToast])

  useEffect(() => {
    executeFetch(filters)
  }, [filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFiltersChange = useCallback((newFilters: Partial<CategoriaFilter>) => {
    setFilters({ ...filters, ...newFilters })
  }, [filters, setFilters])

  const filteredCategories = useMemo(() => {
    if (!filters.q) return categories
    const term = filters.q.toLowerCase()
    return categories.filter(c => c.nombre.toLowerCase().includes(term))
  }, [categories, filters.q])

  return (
    <div className="p-4 md:p-6">
      <CategoryToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={categories.length}
      />

      <CategoryFilters
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
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={32} />}
          title="Sin categorías"
          description="No se encontraron categorías con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primera categoría
            </button>
          }
        />
      ) : (
        <CategoryTable
          data={filteredCategories}
          isLoading={isLoading}
          onEdit={form.openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
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
        title={form.editingCategory ? 'Editar categoría' : 'Nueva categoría'}
        size="md"
      >
        <CategoryForm
          category={form.editingCategory}
          onSubmit={form.submit}
          onCancel={form.close}
          isLoading={form.isLoading}
        />
      </Modal>
    </div>
  )
}

function useCategoryFilters() {
  const [filters, setFilters] = useState<CategoriaFilter>({})
  const handleClear = useCallback(() => {
    setFilters({})
  }, [])
  const hasActiveFilters = !!filters.q

  return { filters, setFilters, handleClear, hasActiveFilters }
}
