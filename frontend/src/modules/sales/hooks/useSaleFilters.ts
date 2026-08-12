import { useState, useCallback } from 'react'
import type { VentaFilter, VentaEstado } from '../types/sale'

interface UseSaleFiltersReturn {
  filters: VentaFilter
  handleFilterChange: (key: keyof VentaFilter, value: VentaEstado | string | number | undefined) => void
  handleClear: () => void
  hasActiveFilters: boolean
}

export function useSaleFilters(initialFilters: VentaFilter = {}): UseSaleFiltersReturn {
  const [filters, setFilters] = useState<VentaFilter>(initialFilters)

  const handleFilterChange = useCallback((key: keyof VentaFilter, value: VentaEstado | string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleClear = useCallback(() => {
    setFilters({})
  }, [])

  const hasActiveFilters = !!(filters.estado || filters.fecha_inicio || filters.fecha_fin || filters.usuario_id || filters.q)

  return {
    filters,
    handleFilterChange,
    handleClear,
    hasActiveFilters,
  }
}
