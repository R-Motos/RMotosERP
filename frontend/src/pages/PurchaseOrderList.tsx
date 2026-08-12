import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { PurchaseOrderToolbar } from '@/modules/purchase-orders/components/PurchaseOrderToolbar'
import { PurchaseOrderTable } from '@/modules/purchase-orders/components/PurchaseOrderTable'
import { PurchaseOrderEmptyState } from '@/modules/purchase-orders/components/PurchaseOrderEmptyState'
import { PurchaseOrderForm } from '@/modules/purchase-orders/components/PurchaseOrderForm'
import { usePurchaseOrders } from '@/modules/purchase-orders/hooks/usePurchaseOrders'
import { usePurchaseOrderForm } from '@/modules/purchase-orders/hooks/usePurchaseOrderForm'
import type { OrdenCompra, OrdenCompraFilter, OrdenCompraCreate, OrdenCompraUpdate } from '@/modules/purchase-orders/types/purchase-order'
import { authStorage } from '@/services/auth.service'

export function PurchaseOrderList() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const { orders, isLoading, error, executeFetch } = usePurchaseOrders()
  const form = usePurchaseOrderForm(() => executeFetch(filters))

  const [filters, setFilters] = useState<OrdenCompraFilter>({})

  useEffect(() => {
    executeFetch(filters)
  }, [filters.estado])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFilterChange = useCallback((key: keyof OrdenCompraFilter, value: OrdenCompraFilter[keyof OrdenCompraFilter]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleClear = useCallback(() => {
    setFilters({})
  }, [])

  const hasActiveFilters = !!filters.estado

  const handleFormSubmit = useCallback(async (data: OrdenCompraCreate | OrdenCompraUpdate) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingOrder ? 'Orden actualizada' : 'Orden creada' })
    } catch {
      addToast({ type: 'error', message: 'Error al guardar la orden' })
    }
  }, [form.submit, form.editingOrder, addToast])

  const handleRowClick = useCallback((order: OrdenCompra) => {
    navigate(`/ordenes-compra/${order.id}`)
  }, [navigate])

  return (
    <div className="p-4 md:p-6">
      <PurchaseOrderToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={orders.length}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={filters.estado || ''}
          onChange={e => handleFilterChange('estado', (e.target.value || undefined) as OrdenCompraFilter['estado'])}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-lg"
        >
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="enviada">Enviada</option>
          <option value="parcialmente_recibida">Parcialmente recibida</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        {hasActiveFilters && (
          <button onClick={handleClear} className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
            Limpiar
          </button>
        )}
      </div>

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
      ) : orders.length === 0 ? (
        <PurchaseOrderEmptyState onCreate={form.openCreate} />
      ) : (
        <PurchaseOrderTable data={orders} isLoading={isLoading} onEdit={form.openEdit} onRowClick={handleRowClick} />
      )}

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.editingOrder ? 'Editar orden de compra' : 'Nueva orden de compra'}
        size="lg"
      >
        <PurchaseOrderForm
          order={form.editingOrder}
          onSubmit={handleFormSubmit}
          onCancel={form.close}
          isLoading={form.isLoading}
          usuarioId={Number(authStorage.getUser()?.id) || 1}
        />
      </Modal>
    </div>
  )
}
