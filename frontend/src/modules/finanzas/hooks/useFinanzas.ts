import { useState, useCallback } from 'react'
import { financaService } from '../services/finanza.service'
import type { MovimientoFinanciero } from '../types/finanza'

interface UseFinanzasReturn {
  movimientos: MovimientoFinanciero[]
  total: number
  overview: {
    total_ingresos: number
    ingresos_venta: number
    ingresos_manual: number
    total_egresos: number
    egresos_compra: number
    egresos_manual: number
    balance: number
    inventario_valor: number
    profit_esperado: number
  } | null
  isLoading: boolean
  error: string | null
  executeFetch: (page?: number, size?: number) => Promise<void>
  reset: () => void
}

export function useFinanzas(): UseFinanzasReturn {
  const [movimientos, setMovimientos] = useState<MovimientoFinanciero[]>([])
  const [total, setTotal] = useState(0)
  const [overview, setOverview] = useState<{
    total_ingresos: number
    ingresos_venta: number
    ingresos_manual: number
    total_egresos: number
    egresos_compra: number
    egresos_manual: number
    balance: number
    inventario_valor: number
    profit_esperado: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (page: number = 1, size: number = 5) => {
    setIsLoading(true)
    setError(null)
    try {
      const [listData, overviewData] = await Promise.all([
        financaService.list(page, size),
        financaService.getOverview(),
      ])
      setMovimientos(listData.items || [])
      setTotal(listData.total || 0)
      setOverview(overviewData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos financieros')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setMovimientos([])
    setTotal(0)
    setOverview(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    movimientos,
    total,
    overview,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}