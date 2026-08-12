import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { SupplierToolbar } from '@/modules/suppliers/components/SupplierToolbar'
import { SupplierFilters } from '@/modules/suppliers/components/SupplierFilters'
import { SupplierTable } from '@/modules/suppliers/components/SupplierTable'
import { SupplierForm } from '@/modules/suppliers/components/SupplierForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { UserPlus } from 'lucide-react'
import { useSuppliers } from '@/modules/suppliers/hooks/useSuppliers'
import { useSupplierFilters } from '@/modules/suppliers/hooks/useSupplierFilters'
import { useSupplierForm } from '@/modules/suppliers/hooks/useSupplierForm'
import { supplierService } from '@/modules/suppliers/services/supplier.service'
import type { Proveedor, ProveedorCreate, ProveedorFilter, ProveedorUpdate } from '@/modules/suppliers/types/supplier'

export function SupplierList() {
  const { addToast } = useToast()

  const { suppliers, isLoading, error, executeFetch } = useSuppliers()
  const { filters, setFilters, handleClear, hasActiveFilters } = useSupplierFilters()
  const handleFormSuccess = useCallback(() => executeFetch(filters), [executeFetch, filters])
  const form = useSupplierForm(handleFormSuccess)

  const [stateTarget, setStateTarget] = useState<Proveedor | null>(null)

  const handleToggleState = useCallback(async () => {
    if (!stateTarget) return
    const nuevoEstado = stateTarget.estado === 'activo' ? 'inactivo' : 'activo'
    try {
      await supplierService.changeState(stateTarget.id, nuevoEstado)
      addToast({ type: 'success', message: `Proveedor ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}` })
      setStateTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al cambiar estado del proveedor' })
    }
  }, [stateTarget, filters, executeFetch, addToast])

  useEffect(() => {
    executeFetch(filters)
  }, [filters.estado, filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFiltersChange = useCallback((newFilters: Partial<ProveedorFilter>) => {
    setFilters({ ...filters, ...newFilters })
  }, [filters, setFilters])

  const handleFormSubmit = useCallback(async (data: ProveedorCreate | ProveedorUpdate) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingSupplier ? 'Proveedor actualizado' : 'Proveedor creado' })
    } catch {
      addToast({ type: 'error', message: 'Error al guardar el proveedor' })
    }
  }, [form.submit, form.editingSupplier, addToast])

  return (
    <div className="p-4 md:p-6">
      <SupplierToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={suppliers.length}
      />

      <SupplierFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.estado && filters.estado !== 'activo' && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Estado: {filters.estado}</span>
          )}
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
      ) : suppliers.length === 0 ? (
        <EmptyState
          icon={<UserPlus size={32} />}
          title="Sin proveedores"
          description="No se encontraron proveedores con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primer proveedor
            </button>
          }
        />
      ) : (
        <SupplierTable
          data={suppliers}
          isLoading={isLoading}
          onEdit={form.openEdit}
          onToggleState={setStateTarget}
        />
      )}

      <Dialog
        isOpen={!!stateTarget}
        onClose={() => setStateTarget(null)}
        onConfirm={handleToggleState}
        title={stateTarget?.estado === 'activo' ? 'Desactivar proveedor' : 'Activar proveedor'}
        description={
          stateTarget
            ? `¿Estás seguro de que deseas ${stateTarget.estado === 'activo' ? 'desactivar' : 'activar'} a ${stateTarget.nombre}?`
            : ''
        }
        confirmLabel={stateTarget?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={stateTarget?.estado === 'activo' ? 'danger' : 'default'}
      />

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.editingSupplier ? 'Editar proveedor' : 'Nuevo proveedor'}
        size="lg"
      >
        <SupplierForm
          supplier={form.editingSupplier}
          onSubmit={handleFormSubmit}
          onCancel={form.close}
          isLoading={form.isLoading}
        />
      </Modal>
    </div>
  )
}
