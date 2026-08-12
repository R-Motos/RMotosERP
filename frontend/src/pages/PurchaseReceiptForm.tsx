import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/layout/ToastContainer'
import { PurchaseReceiptHeader } from '@/modules/purchase-receipts/components/PurchaseReceiptHeader'
import { PurchaseReceiptItems } from '@/modules/purchase-receipts/components/PurchaseReceiptItems'
import { PurchaseReceiptSummary } from '@/modules/purchase-receipts/components/PurchaseReceiptSummary'
import { PurchaseReceiptConfirm } from '@/modules/purchase-receipts/components/PurchaseReceiptConfirm'
import { PurchaseReceiptEmptyState } from '@/modules/purchase-receipts/components/PurchaseReceiptEmptyState'
import { usePurchaseReceiptForm } from '@/modules/purchase-receipts/hooks/usePurchaseReceiptForm'
import { purchaseOrderService } from '@/modules/purchase-orders/services/purchase-order.service'
import { supplierService } from '@/modules/suppliers/services/supplier.service'
import { authStorage } from '@/services/auth.service'
import type { OrdenCompra } from '@/modules/purchase-orders/types/purchase-order'
import type { Proveedor } from '@/modules/suppliers/types/supplier'
import type { DetalleItem, RecepcionCompraCreate } from '@/modules/purchase-receipts/types/purchase-receipt'

export function PurchaseReceiptForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [order, setOrder] = useState<(OrdenCompra & { proveedor_nombre?: string }) | null>(null)
  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = usePurchaseReceiptForm()

  const usuarioId = useMemo(() => {
    const user = authStorage.getUser()
    return user ? Number(user.id) : 1
  }, [])

  const fetchOrder = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const orderData = await purchaseOrderService.get(Number(id))
      let proveedorData: Proveedor | null = null
      try {
        proveedorData = await supplierService.get(orderData.proveedor_id)
      } catch {
        // ignore
      }

      const detalles: DetalleItem[] = orderData.detalles.map(d => ({
        id: d.id,
        producto_id: d.producto_id,
        producto_nombre: d.producto_nombre,
        cantidad_solicitada: Number(d.cantidad),
        cantidad_recibida: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        subtotal: Number(d.subtotal),
      }))

      setOrder({ ...orderData, proveedor_nombre: proveedorData?.nombre })
      setProveedor(proveedorData)
      form.setDetalles(detalles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la orden de compra')
    } finally {
      setIsLoading(false)
    }
  }, [id, form])

  const handleCantidadChange = useCallback((producto_id: number, value: number) => {
    form.updateCantidad(producto_id, value)
  }, [form])

  const handleSubmit = useCallback(async () => {
    if (!order || !proveedor) return

    const detallesValidos = form.detalles.filter(d => d.cantidad_recibida > 0)
    if (detallesValidos.length === 0) {
      addToast({ type: 'error', message: 'Debe recibir al menos un producto' })
      return
    }

    setIsSubmitting(true)
    try {
      const payload: RecepcionCompraCreate = {
        orden_compra_id: order.id,
        proveedor_id: proveedor.id,
        usuario_id: usuarioId,
        observaciones: null,
        estado: 'pendiente',
        detalles: detallesValidos.map(d => ({
          producto_id: d.producto_id,
          cantidad_recibida: d.cantidad_recibida,
          precio_unitario: d.precio_unitario,
        })),
      }

      const result = await form.submit(payload)
      addToast({ type: 'success', message: `Recepción #${result.id} creada exitosamente` })
      navigate(`/ordenes-compra/${order.id}`)
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Error al crear la recepción' })
    } finally {
      setIsSubmitting(false)
    }
  }, [order, proveedor, usuarioId, form, addToast, navigate])

  const handleBack = useCallback(() => {
    navigate(`/ordenes-compra/${id}`)
  }, [navigate, id])

  const productosRecibidos = form.detalles.filter(d => d.cantidad_recibida > 0).length
  const productosPendientes = form.detalles.filter(d => d.cantidad_recibida < d.cantidad_solicitada).length
  const cantidadTotalRecibida = form.detalles.reduce((sum, d) => sum + d.cantidad_recibida, 0)
  const valorRecepcion = form.detalles.reduce((sum, d) => sum + d.cantidad_recibida * d.precio_unitario, 0)
  const canSubmit = form.detalles.some(d => d.cantidad_recibida > 0)

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={fetchOrder} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
        </div>
      </div>
    )
  }

  if (isLoading) {
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

  if (!order) {
    return (
      <div className="p-4 md:p-6">
        <PurchaseReceiptEmptyState onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <PurchaseReceiptHeader orderNumero={order.numero} onBack={handleBack} />

      <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500">Proveedor</p>
            <p className="text-sm font-medium text-neutral-900">{proveedor?.nombre || order.proveedor_nombre || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Número de orden</p>
            <p className="text-sm font-medium text-neutral-900">{order.numero}</p>
          </div>
        </div>
      </div>

      <PurchaseReceiptItems
        detalles={form.detalles}
        onCantidadChange={handleCantidadChange}
        disabled={isSubmitting}
      />

      <div className="mt-6">
        <PurchaseReceiptSummary
          totalProductos={order.detalles.length}
          productosRecibidos={productosRecibidos}
          productosPendientes={productosPendientes}
          cantidadTotalRecibida={cantidadTotalRecibida}
          valorRecepcion={valorRecepcion}
        />
      </div>

      <PurchaseReceiptConfirm
        onSubmit={handleSubmit}
        onCancel={handleBack}
        isLoading={isSubmitting}
        disabled={!canSubmit}
      />
    </div>
  )
}
