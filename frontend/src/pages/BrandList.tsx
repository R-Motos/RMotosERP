import { useState, useCallback, useEffect, useMemo } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { BrandToolbar } from '@/modules/brands/components/BrandToolbar'
import { BrandFilters } from '@/modules/brands/components/BrandFilters'
import { BrandTable } from '@/modules/brands/components/BrandTable'
import { BrandForm } from '@/modules/brands/components/BrandForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tag } from 'lucide-react'
import { useBrands } from '@/modules/brands/hooks/useBrands'
import { useBrandForm } from '@/modules/brands/hooks/useBrands'
import { brandService } from '@/modules/brands/services/brand.service'
import type { Marca, MarcaFilter } from '@/modules/brands/types/brand'

export function BrandList() {
  const { addToast } = useToast()

  const { brands, isLoading, error, executeFetch } = useBrands()
  const { filters, setFilters, handleClear, hasActiveFilters } = useBrandFilters()
  const form = useBrandForm(() => executeFetch(filters))

  const [deleteTarget, setDeleteTarget] = useState<Marca | null>(null)

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await brandService.delete(deleteTarget.id)
      addToast({ type: 'success', message: 'Marca eliminada' })
      setDeleteTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al eliminar la marca' })
    }
  }, [deleteTarget, filters, executeFetch, addToast])

  useEffect(() => {
    executeFetch(filters)
  }, [filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFiltersChange = useCallback((newFilters: Partial<MarcaFilter>) => {
    setFilters({ ...filters, ...newFilters })
  }, [filters, setFilters])

  const filteredBrands = useMemo(() => {
    if (!filters.q) return brands
    const term = filters.q.toLowerCase()
    return brands.filter(b => b.nombre.toLowerCase().includes(term))
  }, [brands, filters.q])

  return (
    <div className="p-4 md:p-6">
      <BrandToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={brands.length}
      />

      <BrandFilters
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
      ) : filteredBrands.length === 0 ? (
        <EmptyState
          icon={<Tag size={32} />}
          title="Sin marcas"
          description="No se encontraron marcas con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primera marca
            </button>
          }
        />
      ) : (
        <BrandTable
          data={filteredBrands}
          isLoading={isLoading}
          onEdit={form.openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar marca"
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
        title={form.editingBrand ? 'Editar marca' : 'Nueva marca'}
        size="md"
      >
        <BrandForm
          brand={form.editingBrand}
          onSubmit={form.submit}
          onCancel={form.close}
          isLoading={form.isLoading}
        />
      </Modal>
    </div>
  )
}

function useBrandFilters() {
  const [filters, setFilters] = useState<MarcaFilter>({})
  const handleClear = useCallback(() => {
    setFilters({})
  }, [])
  const hasActiveFilters = !!filters.q

  return { filters, setFilters, handleClear, hasActiveFilters }
}
