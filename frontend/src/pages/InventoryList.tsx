import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { InventoryToolbar } from '@/modules/inventory/components/InventoryToolbar'
import { InventoryFilters } from '@/modules/inventory/components/InventoryFilters'
import { InventoryTable } from '@/modules/inventory/components/InventoryTable'
import { InventoryEmptyState } from '@/modules/inventory/components/InventoryEmptyState'
import { useInventory } from '@/modules/inventory/hooks/useInventory'
import { useInventoryFilters } from '@/modules/inventory/hooks/useInventoryFilters'

export function InventoryList() {
  const navigate = useNavigate()

  const { products, total, page, size, isLoading, error, executeFetch, marcas, categorias, etiquetas } = useInventory()
  const { filters, handleFilterChange, handleClear, hasActiveFilters, setPage } = useInventoryFilters()

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 0) {
        handleFilterChange(key as keyof typeof filters, value as any)
      }
    })
  }, [handleFilterChange])

  useEffect(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleRowClick = useCallback((product: any) => {
    navigate(`/inventario/${product.id}`)
  }, [navigate])

  const totalPages = Math.ceil(total / size)

  return (
    <div className="p-4 md:p-6">
      <InventoryToolbar
        onRefresh={handleRefresh}
        isLoading={isLoading}
        total={total}
      />

      <InventoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        marcas={marcas}
        categorias={categorias}
        etiquetas={etiquetas}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.q && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Búsqueda</span>}
          {filters.estado && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Estado: {filters.estado}</span>}
          {filters.marca_id && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Marca</span>}
          {filters.categoria_id && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Categoría</span>}
          {filters.etiqueta_id && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Etiqueta</span>}
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
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <InventoryEmptyState onCreate={() => navigate('/productos')} />
      ) : (
        <>
          <InventoryTable data={products} isLoading={isLoading} onRowClick={handleRowClick} />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-neutral-500">
              Mostrando {products.length} de {total} productos
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
            <div className="flex items-center justify-between mt-4">
              <Button variant="secondary" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                Anterior
              </Button>
              <span className="text-sm text-neutral-500">Página {page} de {totalPages}</span>
              <Button variant="secondary" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
