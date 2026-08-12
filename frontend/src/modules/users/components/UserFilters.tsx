import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { UserFilter } from '../types/user'

interface UserFiltersProps {
  filters: UserFilter
  onFilterChange: (key: keyof UserFilter, value: unknown) => void
  onClear: () => void
}

export function UserFilters({ filters, onFilterChange, onClear }: UserFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('q', e.target.value || undefined)
  }, [onFilterChange])

  const handleEstadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('estado', (e.target.value as UserFilter['estado']) || undefined)
  }, [onFilterChange])

  const hasActiveFilters = !!(filters.q || filters.estado)

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre o usuario..."
            value={filters.q || ''}
            onChange={handleSearchChange}
            leftIcon={<Search size={16} />}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <SlidersHorizontal size={16} />
          {showFilters ? 'Ocultar' : 'Filtros'}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <Select
            size="sm"
            fullWidth={false}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
            value={filters.estado || ''}
            onChange={handleEstadoChange}
          />
          {hasActiveFilters && (
            <button
              onClick={() => {
                onClear()
                setShowFilters(false)
              }}
              className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors whitespace-nowrap"
            >
              Limpiar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
