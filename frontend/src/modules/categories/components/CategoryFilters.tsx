import { useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import type { CategoriaFilter } from '../types/category'

interface CategoryFiltersProps {
  filters: CategoriaFilter
  onFiltersChange: (filters: CategoriaFilter) => void
}

export function CategoryFilters({ filters, onFiltersChange }: CategoryFiltersProps) {
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
        placeholder="Buscar categoría..."
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
