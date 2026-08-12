import { useState, useCallback } from 'react'
import type { ProductoFilter } from '../types/inventory'

interface UseInventoryFiltersReturn {
  filters: ProductoFilter
  searchTerm: string
  setSearchTerm: (value: string) => void
  handleFilterChange: (key: keyof ProductoFilter, value: unknown) => void
  handleSearch: () => void
  handleClear: () => void
  hasActiveFilters: boolean
  setPage: (page: number) => void
}

export function useInventoryFilters(initialFilters: ProductoFilter = { page: 1, size: 20, order_by: 'id' }): UseInventoryFiltersReturn {
  const [filters, setFilters] = useState<ProductoFilter>(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterChange = useCallback((key: keyof ProductoFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  const handleSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, q: searchTerm || undefined, page: 1 }))
  }, [searchTerm])

  const handleClear = useCallback(() => {
    setFilters({ page: 1, size: 20, order_by: 'id' })
    setSearchTerm('')
  }, [])

  const hasActiveFilters = !!(filters.q || filters.marca_id || filters.categoria_id || filters.estado)

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  return {
    filters,
    searchTerm,
    setSearchTerm,
    handleFilterChange,
    handleSearch,
    handleClear,
    hasActiveFilters,
    setPage,
  }
}
