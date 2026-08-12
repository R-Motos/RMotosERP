import { useState, useCallback } from 'react'
import { purchaseOrderService } from '../services/purchase-order.service'
import type { OrdenCompra, OrdenCompraCreate, OrdenCompraUpdate } from '../types/purchase-order'

interface UsePurchaseOrderFormReturn {
  isOpen: boolean
  editingOrder: OrdenCompra | null
  isLoading: boolean
  openCreate: () => void
  openEdit: (order: OrdenCompra) => void
  close: () => void
  submit: (data: OrdenCompraCreate | OrdenCompraUpdate) => Promise<void>
}

export function usePurchaseOrderForm(onSuccess: () => void): UsePurchaseOrderFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<OrdenCompra | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingOrder(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((order: OrdenCompra) => {
    setEditingOrder(order)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingOrder(null)
  }, [])

  const submit = useCallback(async (data: OrdenCompraCreate | OrdenCompraUpdate) => {
    setIsLoading(true)
    try {
      if (editingOrder) {
        await purchaseOrderService.update(editingOrder.id, data as OrdenCompraUpdate)
      } else {
        await purchaseOrderService.create(data as OrdenCompraCreate)
      }
      close()
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [editingOrder, close, onSuccess])

  return {
    isOpen,
    editingOrder,
    isLoading,
    openCreate,
    openEdit,
    close,
    submit,
  }
}
