import { useState, useCallback } from 'react'
import type { UserFilter } from '../types/user'

interface UseUserFiltersReturn {
  filters: UserFilter
  handleFilterChange: (key: keyof UserFilter, value: unknown) => void
  handleClear: () => void
  hasActiveFilters: boolean
}

export function useUserFilters(initialFilters: UserFilter = {}): UseUserFiltersReturn {
  const [filters, setFilters] = useState<UserFilter>(initialFilters)

  const handleFilterChange = useCallback((key: keyof UserFilter, value: unknown) => {
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