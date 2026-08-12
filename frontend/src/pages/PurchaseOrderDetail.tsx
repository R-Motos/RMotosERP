import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PurchaseOrderDetailHeader } from '@/modules/purchase-orders/components/PurchaseOrderDetailHeader'
import { PurchaseOrderInfo } from '@/modules/purchase-orders/components/PurchaseOrderInfo'
import { PurchaseOrderProducts } from '@/modules/purchase-orders/components/PurchaseOrderProducts'
import { PurchaseOrderTotals } from '@/modules/purchase-orders/components/PurchaseOrderTotals'
import { PurchaseOrderForm } from '@/modules/purchase-orders/components/PurchaseOrderForm'
import { usePurchaseOrderDetail } from '@/modules/purchase-orders/hooks/usePurchaseOrderDetail'
import { usePurchaseOrderForm } from '@/modules/purchase-orders/hooks/usePurchaseOrderForm'
import { authStorage } from '@/services/auth.service'
import type { OrdenCompraCreate, OrdenCompraUpdate } from '@/modules/purchase-orders/types/purchase-order'
import { ESTADOS_INMODIFICABLES } from '@/modules/purchase-orders/types/purchase-order'

export function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const { order, proveedor, error, refetch } = usePurchaseOrderDetail(Number(id))
  const form = usePurchaseOrderForm(refetch)

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const canEdit = order ? !ESTADOS_INMODIFICABLES.includes(order.estado as 'completada' | 'cancelada') : false
  const canCancel = order ? !ESTADOS_INMODIFICABLES.includes(order.estado as 'completada' | 'cancelada') : false
  const canReceive = order ? !ESTADOS_INMODIFICABLES.includes(order.estado as 'completada' | 'cancelada') : false

  const handleBack = useCallback(() => {
    navigate('/ordenes-compra')
  }, [navigate])

  const handleEdit = useCallback(() => {
    if (order) {
      form.openEdit(order)
    }
  }, [order, form.openEdit])

  const handleCancelClick = useCallback(() => {
    setShowCancelConfirm(true)
  }, [])

  const handleCancelConfirm = useCallback(async () => {
    if (!order) return
    setIsCancelling(true)
    try {
      await form.submit({ estado: 'cancelada', observaciones: order.observaciones })
      addToast({ type: 'success', message: `Orden ${order.numero} cancelada` })
      setShowCancelConfirm(false)
      refetch()
    } catch {
      addToast({ type: 'error', message: 'Error al cancelar la orden' })
    } finally {
      setIsCancelling(false)
    }
  }, [order, form.submit, addToast, refetch])

  const handlePrint = useCallback(() => {
    addToast({ type: 'info', message: 'Función de impresión no disponible aún' })
  }, [addToast])

  const handleReceive = useCallback(() => {
    navigate(`/ordenes-compra/${id}/recibir`)
  }, [navigate, id])

  const handleFormSubmit = useCallback(async (data: OrdenCompraCreate | OrdenCompraUpdate) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingOrder ? 'Orden actualizada' : 'Orden creada' })
      refetch()
    } catch {
      addToast({ type: 'error', message: 'Error al guardar la orden' })
    }
  }, [form.submit, form.editingOrder, addToast, refetch])

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={refetch} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const cantidadUnidades = order.detalles.reduce((sum, d) => sum + Number(d.cantidad), 0)

  return (
    <div className="p-4 md:p-6">
      <PurchaseOrderDetailHeader
        numero={order.numero}
        estado={order.estado}
        onBack={handleBack}
        onEdit={handleEdit}
        onCancel={handleCancelClick}
        onPrint={handlePrint}
        onReceive={handleReceive}
        canEdit={canEdit}
        canCancel={canCancel}
        canReceive={canReceive}
        isCancelling={isCancelling}
        isEditing={form.isLoading}
      />

      <PurchaseOrderInfo
        proveedorNombre={proveedor?.nombre || order.proveedor_nombre}
        usuarioNombre={order.usuario_nombre}
        observaciones={order.observaciones}
        createdAt={order.created_at}
        updatedAt={order.updated_at}
      />

      <PurchaseOrderProducts detalles={order.detalles} />

      <PurchaseOrderTotals
        total={Number(order.total)}
        cantidadItems={order.detalles.length}
        cantidadUnidades={cantidadUnidades}
      />

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

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Cancelar orden</h3>
            <p className="text-sm text-neutral-600 mb-4">
              ¿Estás seguro de que deseas cancelar la orden {order.numero}? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowCancelConfirm(false)} disabled={isCancelling}>
                No, mantener
              </Button>
              <Button variant="primary" onClick={handleCancelConfirm} loading={isCancelling}>
                Sí, cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
