import { useState, useCallback } from 'react'
import { purchaseReceiptService } from '../services/purchase-receipt.service'
import type { RecepcionCompraCreate, RecepcionCompra, DetalleItem } from '../types/purchase-receipt'

interface UsePurchaseReceiptFormReturn {
  isLoading: boolean
  detalles: DetalleItem[]
  setDetalles: (detalles: DetalleItem[]) => void
  updateCantidad: (producto_id: number, cantidad: number) => void
  submit: (data: RecepcionCompraCreate) => Promise<RecepcionCompra>
}

export function usePurchaseReceiptForm(): UsePurchaseReceiptFormReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [detalles, setDetalles] = useState<DetalleItem[]>([])

  const updateCantidad = useCallback((producto_id: number, cantidad: number) => {
    setDetalles(prev => prev.map(d => {
      if (d.producto_id === producto_id) {
        const newCantidad = Math.min(cantidad, d.cantidad_solicitada)
        return {
          ...d,
          cantidad_recibida: Math.max(0, newCantidad),
          subtotal: Math.max(0, newCantidad) * d.precio_unitario,
        }
      }
      return d
    }))
  }, [])

  const submit = useCallback(async (data: RecepcionCompraCreate): Promise<RecepcionCompra> => {
    setIsLoading(true)
    try {
      const result = await purchaseReceiptService.create(data)
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    detalles,
    setDetalles,
    updateCantidad,
    submit,
  }
}
