import { useState, useCallback } from 'react'
import type { ProveedorFilter } from '../types/supplier'

interface UseSupplierFiltersReturn {
  filters: ProveedorFilter
  setFilters: (updater: Partial<ProveedorFilter>) => void
  handleFilterChange: (key: keyof ProveedorFilter, value: unknown) => void
  handleClear: () => void
  hasActiveFilters: boolean
}

export function useSupplierFilters(initialFilters: ProveedorFilter = { estado: 'activo' }): UseSupplierFiltersReturn {
  const [filters, setFilters] = useState<ProveedorFilter>(initialFilters)

  const handleFilterChange = useCallback((key: keyof ProveedorFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value } as ProveedorFilter))
  }, [])

  const handleClear = useCallback(() => {
    setFilters({ estado: 'activo', q: '' } as ProveedorFilter)
  }, [])

  const hasActiveFilters = !!(filters.q || (filters.estado && filters.estado !== 'activo'))

  return {
    filters,
    setFilters: (updater) => setFilters(prev => ({ ...prev, ...updater } as ProveedorFilter)),
    handleFilterChange,
    handleClear,
    hasActiveFilters,
  }
}
