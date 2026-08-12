import { useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import type { MarcaFilter } from '../types/brand'

interface BrandFiltersProps {
  filters: MarcaFilter
  onFiltersChange: (filters: MarcaFilter) => void
}

export function BrandFilters({ filters, onFiltersChange }: BrandFiltersProps) {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, q: e.target.value || undefined })
  }, [filters, onFiltersChange])

  const handleClear = useCallback(() => {
    onFiltersChange({})
  }, [onFiltersChange])

  const hasActiveFilters = !!filters.q

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Buscar"
        placeholder="Buscar marca..."
        value={filters.q || ''}
        onChange={handleSearchChange}
      />
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
