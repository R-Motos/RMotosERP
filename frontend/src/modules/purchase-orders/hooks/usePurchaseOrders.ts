import { useState, useCallback } from 'react'
import { purchaseOrderService } from '../services/purchase-order.service'
import type { OrdenCompra, OrdenCompraFilter } from '../types/purchase-order'

interface UsePurchaseOrdersReturn {
  orders: OrdenCompra[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: OrdenCompraFilter) => Promise<void>
  reset: () => void
}

export function usePurchaseOrders(): UsePurchaseOrdersReturn {
  const [orders, setOrders] = useState<OrdenCompra[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: OrdenCompraFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await purchaseOrderService.list(filters)
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes de compra')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setOrders([])
    setError(null)
  }, [])

  return {
    orders,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}
