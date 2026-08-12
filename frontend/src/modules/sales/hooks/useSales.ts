import { useState, useCallback } from 'react'
import { saleService } from '../services/sale.service'
import type { Venta, VentaFilter } from '../types/sale'

interface UseSalesReturn {
  sales: Venta[]
  total: number
  isLoading: boolean
  error: string | null
  executeFetch: (filters: VentaFilter) => Promise<void>
  reset: () => void
}

type SaleListResult = Venta[] | { items: Venta[]; total: number }

export function useSales(): UseSalesReturn {
  const [sales, setSales] = useState<Venta[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: VentaFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = (await saleService.list(filters)) as SaleListResult

      if (Array.isArray(data)) {
        const items = data
        const total = items.reduce((sum, venta) => sum + Number(venta.total || 0), 0)
        setSales(items)
        setTotal(total)
      } else {
        setSales(Array.isArray(data.items) ? data.items : [])
        setTotal(typeof data.total === 'number' ? data.total : 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ventas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSales([])
    setTotal(0)
    setError(null)
  }, [])

  return {
    sales,
    total,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}
