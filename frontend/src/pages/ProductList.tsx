import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { ProductToolbar } from '@/modules/products/components/ProductToolbar'
import { ProductFilters } from '@/modules/products/components/ProductFilters'
import { ProductTable } from '@/modules/products/components/ProductTable'
import { ProductForm } from '@/modules/products/components/ProductForm'
import { ProductView } from '@/modules/products/components/ProductView'
import { DeleteProductDialog } from '@/modules/products/components/DeleteProductDialog'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'
import { useProducts } from '@/modules/products/hooks/useProducts'
import { useProductFilters } from '@/modules/products/hooks/useProductFilters'
import { useProductForm } from '@/modules/products/hooks/useProductForm'
import type { Producto, ProductoCreate, ProductoUpdate } from '@/modules/products/types/product'

export function ProductList() {
  const { addToast } = useToast()

  const { products, total, page, size, isLoading, error, executeFetch, marcas, categorias, etiquetas } = useProducts()

  const { filters, handleFilterChange, handleClear, hasActiveFilters, setPage } = useProductFilters()

  const handleFormSuccess = useCallback(() => executeFetch(filters), [executeFetch, filters])
  const form = useProductForm(handleFormSuccess)

  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null)

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await form.remove(deleteTarget.id)
      addToast({ type: 'success', message: `Producto "${deleteTarget.nombre}" eliminado` })
    } catch {
      addToast({ type: 'error', message: 'Error al eliminar el producto' })
    }
    setDeleteTarget(null)
  }, [deleteTarget, form.remove, addToast])

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

  const handleView = useCallback((product: Producto) => {
    form.openView(product)
  }, [form.openView])

  const handleToggleState = useCallback(async (product: Producto) => {
    const nuevoEstado = product.estado === 'publicado' ? 'inactivo' : 'publicado'
    try {
      await form.updateState(product.id, nuevoEstado)
      addToast({ type: 'success', message: `Producto ${nuevoEstado === 'publicado' ? 'activado' : 'desactivado'}` })
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al cambiar estado del producto' })
    }
  }, [form.updateState, addToast, executeFetch, filters])

  const handleFormSubmit = useCallback(async (data: ProductoCreate | ProductoUpdate) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingProduct ? 'Producto actualizado' : 'Producto creado' })
    } catch {
      addToast({ type: 'error', message: 'Error al guardar el producto' })
    }
  }, [form.submit, form.editingProduct, addToast])

  const totalPages = Math.ceil(total / size)

  return (
    <div className="p-4 md:p-6">
      <ProductToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={total}
      />

      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        marcas={marcas}
        categorias={categorias}
        etiquetas={etiquetas}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
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
        <EmptyState
          icon={<Package size={32} />}
          title="Sin productos"
          description="No se encontraron productos con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primer producto
            </button>
          }
        />
      ) : (
        <>
          <ProductTable
            data={products}
            isLoading={isLoading}
            onView={handleView}
            onEdit={form.openEdit}
            onToggleState={handleToggleState}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-neutral-500">
              Mostrando {products.length} de {total} productos
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
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
        </>
      )}

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.readOnly ? 'Ver producto' : form.editingProduct ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        {form.readOnly && form.editingProduct ? (
          <ProductView product={form.editingProduct} onClose={form.close} />
        ) : (
          <ProductForm
            product={form.editingProduct}
            marcas={marcas}
            categorias={categorias}
            etiquetas={etiquetas}
            onSubmit={handleFormSubmit}
            onCancel={form.close}
            isLoading={form.isLoading}
            readOnly={form.readOnly}
          />
        )}
      </Modal>

      <DeleteProductDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        productName={deleteTarget?.nombre || ''}
        isLoading={form.isLoading}
      />
    </div>
  )
}