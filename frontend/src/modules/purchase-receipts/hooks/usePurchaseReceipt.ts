import { useState, useCallback } from 'react'
import { purchaseReceiptService } from '../services/purchase-receipt.service'
import type { RecepcionCompra, RecepcionCompraFilter } from '../types/purchase-receipt'

interface UsePurchaseReceiptReturn {
  receipts: RecepcionCompra[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: RecepcionCompraFilter) => Promise<void>
  reset: () => void
}

export function usePurchaseReceipt(): UsePurchaseReceiptReturn {
  const [receipts, setReceipts] = useState<RecepcionCompra[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: RecepcionCompraFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await purchaseReceiptService.list(filters)
      setReceipts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recepciones')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setReceipts([])
    setError(null)
  }, [])

  return {
    receipts,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}
