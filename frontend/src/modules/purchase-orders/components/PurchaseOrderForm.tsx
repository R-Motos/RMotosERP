import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { PurchaseOrderSupplier } from './PurchaseOrderSupplier'
import { PurchaseOrderProductSearch } from './PurchaseOrderProductSearch'
import { PurchaseOrderItemsTable } from './PurchaseOrderItemsTable'
import { PurchaseOrderSummary } from './PurchaseOrderSummary'
import type { OrdenCompra, OrdenCompraDetalle, OrdenCompraDetalleCreate, OrdenCompraCreate, OrdenCompraUpdate, OrdenCompraEstado, DetalleItem } from '../types/purchase-order'

const ESTADO_OPTIONS = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'parcialmente_recibida', label: 'Parcialmente recibida' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
]

interface PurchaseOrderFormProps {
  order: OrdenCompra | null
  onSubmit: (data: OrdenCompraCreate | OrdenCompraUpdate) => void
  onCancel: () => void
  isLoading: boolean
  usuarioId: number
}

export function PurchaseOrderForm({ order, onSubmit, onCancel, isLoading, usuarioId }: PurchaseOrderFormProps) {
  const [proveedorId, setProveedorId] = useState<number | null>(order?.proveedor_id || null)
  const [detalles, setDetalles] = useState<DetalleItem[]>(
    order?.detalles.map((d: OrdenCompraDetalle) => ({
      id: d.id,
      orden_id: d.orden_id,
      producto_id: d.producto_id,
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      producto_nombre: d.producto_nombre,
      subtotal: Number(d.subtotal),
    })) || []
  )
  const [observaciones, setObservaciones] = useState(order?.observaciones || '')
  const [estado, setEstado] = useState<OrdenCompraEstado>(order?.estado || 'borrador')

  useEffect(() => {
    if (order) {
      setProveedorId(order.proveedor_id)
      setDetalles(order.detalles.map((d: OrdenCompraDetalle) => ({
        id: d.id,
        orden_id: d.orden_id,
        producto_id: d.producto_id,
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        producto_nombre: d.producto_nombre,
        subtotal: Number(d.subtotal),
      })))
      setObservaciones(order.observaciones || '')
      setEstado(order.estado)
    } else {
      setProveedorId(null)
      setDetalles([])
      setObservaciones('')
      setEstado('borrador')
    }
  }, [order])

  const handleAddProduct = useCallback((product: { id: number; nombre: string; precio_compra: number }, currentDetalles: DetalleItem[]) => {
    const newDetalle: DetalleItem = {
      producto_id: product.id,
      cantidad: 1,
      precio_unitario: product.precio_compra,
      producto_nombre: product.nombre,
      subtotal: product.precio_compra,
    }
    setDetalles([...currentDetalles, newDetalle])
  }, [])

  const handleUpdateDetalle = useCallback((index: number, field: 'cantidad' | 'precio_unitario', value: number) => {
    setDetalles(prev => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value,
        subtotal: field === 'cantidad' ? value * updated[index].precio_unitario : updated[index].cantidad * value,
      }
      return updated
    })
  }, [])

  const handleRemoveDetalle = useCallback((index: number) => {
    setDetalles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (order) {
      onSubmit({
        estado,
        observaciones: observaciones || null,
      } as OrdenCompraUpdate)
    } else {
      if (!proveedorId) return
      if (detalles.length === 0) return
      const cleanDetalles: OrdenCompraDetalleCreate[] = detalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
      }))
      const usuario_id = usuarioId
      onSubmit({
        proveedor_id: proveedorId,
        usuario_id,
        observaciones: observaciones || null,
        estado: 'borrador',
        detalles: cleanDetalles,
      } as OrdenCompraCreate)
    }
  }, [order, estado, observaciones, proveedorId, detalles, onSubmit])

  const canSubmit = order ? !isLoading : (proveedorId && detalles.length > 0 && !isLoading)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!order && (
        <>
          <PurchaseOrderSupplier
            proveedorId={proveedorId}
            onProveedorChange={setProveedorId}
            disabled={isLoading}
          />

          <PurchaseOrderProductSearch
            detalles={detalles}
            onAddProduct={handleAddProduct}
            disabled={isLoading}
          />

          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Productos</h3>
            <PurchaseOrderItemsTable
              detalles={detalles}
              onUpdateDetalle={handleUpdateDetalle}
              onRemoveDetalle={handleRemoveDetalle}
              disabled={isLoading}
            />
          </div>

          <PurchaseOrderSummary detalles={detalles} />
        </>
      )}

      {order && (
        <div>
          <Select
            label="Estado"
            options={ESTADO_OPTIONS}
            value={estado}
            onChange={e => setEstado(e.target.value as OrdenCompraEstado)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
          disabled={isLoading}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg disabled:bg-neutral-100"
          placeholder="Observaciones adicionales..."
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={isLoading} disabled={!canSubmit}>Guardar</Button>
      </div>
    </form>
  )
}

