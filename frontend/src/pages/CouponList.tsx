import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { CouponToolbar } from '@/modules/coupons/components/CouponToolbar'
import { CouponFilters } from '@/modules/coupons/components/CouponFilters'
import { CouponTable } from '@/modules/coupons/components/CouponTable'
import { CouponForm } from '@/modules/coupons/components/CouponForm'
import { CouponView } from '@/modules/coupons/components/CouponView'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tag } from 'lucide-react'
import { useCoupons } from '@/modules/coupons/hooks/useCoupons'
import { useCouponForm } from '@/modules/coupons/hooks/useCoupons'
import { useCouponFilters } from '@/modules/coupons/hooks/useCouponFilters'
import type { Cupon } from '@/modules/coupons/types/coupon'

export function CouponList() {
  const { addToast } = useToast()

  const { coupons, isLoading, error, executeFetch } = useCoupons()
  const { filters, handleFilterChange, handleClear, hasActiveFilters } = useCouponFilters()
  const form = useCouponForm(() => executeFetch(filters))

  const [toggleTarget, setToggleTarget] = useState<Cupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Cupon | null>(null)

  const handleToggleState = useCallback(async () => {
    if (!toggleTarget) return
    const nuevoEstado = toggleTarget.estado === 'activo' ? 'inactivo' : 'activo'
    try {
      await form.changeState(toggleTarget.id, nuevoEstado)
      addToast({ type: 'success', message: `Cupón ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}` })
      setToggleTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al cambiar estado del cupón' })
    }
  }, [toggleTarget, form.changeState, addToast, executeFetch, filters])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await form.deleteCoupon(deleteTarget.id)
      addToast({ type: 'success', message: 'Cupón eliminado' })
      setDeleteTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al eliminar el cupón' })
    }
  }, [deleteTarget, form.deleteCoupon, addToast, executeFetch, filters])

  const handleFormSubmit = useCallback(async (data: { codigo?: string; tipo?: 'porcentaje' | 'valor_fijo'; valor?: number; fecha_inicio?: string; fecha_fin?: string; uso_maximo?: number; estado?: 'activo' | 'inactivo' }) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingCoupon ? 'Cupón actualizado' : 'Cupón creado' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar el cupón'
      addToast({ type: 'error', message })
    }
  }, [form.submit, form.editingCoupon, addToast])

  useEffect(() => {
    executeFetch(filters)
  }, [executeFetch, filters.estado, filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleView = useCallback((coupon: Cupon) => {
    form.openView(coupon)
  }, [form.openView])

  const handleEdit = useCallback((coupon: Cupon) => {
    form.openEdit(coupon)
  }, [form.openEdit])

  return (
    <div className="p-4 md:p-6">
      <CouponToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={coupons.length}
      />

      <CouponFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.q && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Búsqueda</span>}
          {filters.estado && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Estado: {filters.estado}</span>}
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
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={<Tag size={32} />}
          title="Sin cupones"
          description="No se encontraron cupones con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primer cupón
            </button>
          }
        />
      ) : (
        <>
          <CouponTable
            data={coupons}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onToggleState={(coupon) => setToggleTarget(coupon)}
            onDelete={(coupon) => setDeleteTarget(coupon)}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-neutral-500">
              Mostrando {coupons.length} cupones
            </p>
          </div>
        </>
      )}

      <Dialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleState}
        title={toggleTarget?.estado === 'activo' ? 'Desactivar cupón' : 'Activar cupón'}
        description={
          toggleTarget
            ? `¿Estás seguro de que deseas ${toggleTarget.estado === 'activo' ? 'desactivar' : 'activar'} el cupón "${toggleTarget.codigo}"?`
            : ''
        }
        confirmLabel={toggleTarget?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={toggleTarget?.estado === 'activo' ? 'danger' : 'default'}
      />

      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar cupón"
        description={
          deleteTarget
            ? `¿Estás seguro de que deseas eliminar el cupón "${deleteTarget.codigo}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.readOnly ? 'Ver cupón' : form.editingCoupon ? 'Editar cupón' : 'Nuevo cupón'}
        size="lg"
      >
        {form.readOnly && form.editingCoupon ? (
          <CouponView product={form.editingCoupon} onClose={form.close} />
        ) : (
          <CouponForm
            coupon={form.editingCoupon}
            onSubmit={handleFormSubmit}
            onCancel={form.close}
            isLoading={form.isLoading}
            readOnly={form.readOnly}
          />
        )}
      </Modal>
    </div>
  )
}
