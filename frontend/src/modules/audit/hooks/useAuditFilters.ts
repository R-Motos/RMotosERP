import { useState, useCallback } from 'react'
import type { AuditFilter, AuditAccion } from '../types/audit'

const ACCIONES: AuditAccion[] = ['crear', 'editar', 'eliminar', 'anular', 'aprobar', 'login', 'logout']

interface UseAuditFiltersReturn {
  filters: AuditFilter
  searchTerm: string
  setSearchTerm: (value: string) => void
  handleFilterChange: (key: keyof AuditFilter, value: unknown) => void
  handleSearch: () => void
  handleClear: () => void
  hasActiveFilters: boolean
  setPage: (page: number) => void
}

export function useAuditFilters(initialFilters: AuditFilter = { page: 1, size: 20 }): UseAuditFiltersReturn {
  const [filters, setFilters] = useState<AuditFilter>(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterChange = useCallback((key: keyof AuditFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  const handleSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, modulo: searchTerm || undefined, page: 1 }))
  }, [searchTerm])

  const handleClear = useCallback(() => {
    setFilters({ page: 1, size: 20 })
    setSearchTerm('')
  }, [])

  const hasActiveFilters = !!(filters.usuario_id || filters.modulo || filters.accion || filters.fecha_inicio || filters.fecha_fin)

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

export { ACCIONES }
