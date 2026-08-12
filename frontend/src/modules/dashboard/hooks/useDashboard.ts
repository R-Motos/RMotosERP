import { useState, useCallback, useEffect } from 'react'
import { dashboardService } from '../services/dashboard.service'
import type { ResumenResponse, VentasResponse, ProductosResponse } from '../types/dashboard'

interface UseDashboardReturn {
  resumen: ResumenResponse | null
  ventas: VentasResponse | null
  productos: ProductosResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboard(): UseDashboardReturn {
  const [resumen, setResumen] = useState<ResumenResponse | null>(null)
  const [ventas, setVentas] = useState<VentasResponse | null>(null)
  const [productos, setProductos] = useState<ProductosResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [resumenData, ventasData, productosData] = await Promise.all([
        dashboardService.getResumen(),
        dashboardService.getVentas(),
        dashboardService.getProductos(),
      ])
      setResumen(resumenData)
      setVentas(ventasData)
      setProductos(productosData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    resumen,
    ventas,
    productos,
    isLoading,
    error,
    refetch: fetchDashboard,
  }
}
