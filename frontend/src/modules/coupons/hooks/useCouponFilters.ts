import { useState, useCallback } from 'react'
import type { CuponFilter } from '../types/coupon'

interface UseCouponFiltersReturn {
  filters: CuponFilter
  handleFilterChange: (key: keyof CuponFilter, value: unknown) => void
  handleClear: () => void
  hasActiveFilters: boolean
}

export function useCouponFilters(initialFilters: CuponFilter = {}): UseCouponFiltersReturn {
  const [filters, setFilters] = useState<CuponFilter>(initialFilters)

  const handleFilterChange = useCallback((key: keyof CuponFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleClear = useCallback(() => {
    setFilters({})
  }, [])

  const hasActiveFilters = !!(filters.q || filters.estado)

  return {
    filters,
    handleFilterChange,
    handleClear,
    hasActiveFilters,
  }
}
