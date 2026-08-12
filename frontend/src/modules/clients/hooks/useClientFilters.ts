import { useState, useCallback } from 'react'
import type { ClienteFilter } from '../types/client'

interface UseClientFiltersReturn {
  filters: ClienteFilter
  setFilters: (updater: Partial<ClienteFilter>) => void
  handleFilterChange: (key: keyof ClienteFilter, value: unknown) => void
  handleClear: () => void
  hasActiveFilters: boolean
}

export function useClientFilters(initialFilters: ClienteFilter = { estado: 'activo' }): UseClientFiltersReturn {
  const [filters, setFilters] = useState<ClienteFilter>(initialFilters)

  const handleFilterChange = useCallback((key: keyof ClienteFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value } as ClienteFilter))
  }, [])

  const handleClear = useCallback(() => {
    setFilters({ estado: 'activo', q: '' } as ClienteFilter)
  }, [])

  const hasActiveFilters = !!(filters.q || (filters.estado && filters.estado !== 'activo'))

  return {
    filters,
    setFilters: (updater) => setFilters(prev => ({ ...prev, ...updater } as ClienteFilter)),
    handleFilterChange,
    handleClear,
    hasActiveFilters,
  }
}
