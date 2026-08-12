import { useState, useCallback, useEffect } from 'react'
import { inventoryService } from '../services/inventory.service'
import type { Producto } from '../types/inventory'

interface UseInventoryDetailReturn {
  product: Producto | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useInventoryDetail(id: number): UseInventoryDetailReturn {
  const [product, setProduct] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await inventoryService.get(id)
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el producto')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return {
    product,
    isLoading,
    error,
    refetch: fetchDetail,
  }
}
