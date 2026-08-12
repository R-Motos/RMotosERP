import { useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ProveedorFilter } from '../types/supplier'

interface SupplierFiltersProps {
  filters: ProveedorFilter
  onFiltersChange: (filters: ProveedorFilter) => void
}

export function SupplierFilters({ filters, onFiltersChange }: SupplierFiltersProps) {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined
    onFiltersChange({ ...filters, q: value })
  }, [filters, onFiltersChange])

  const handleEstadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, estado: (e.target.value as ProveedorFilter['estado']) || undefined })
  }, [filters, onFiltersChange])

  const handleClear = useCallback(() => {
    onFiltersChange({ estado: 'activo', q: '' })
  }, [onFiltersChange])

  const hasActiveFilters = !!(filters.q || (filters.estado && filters.estado !== 'activo'))

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Buscar"
        placeholder="Buscar por nombre, NIT, email o teléfono..."
        value={filters.q || ''}
        onChange={handleSearchChange}
        leftIcon={<Search size={16} />}
      />
      <div className="flex items-center gap-2">
        <Select
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ]}
          value={filters.estado || ''}
          onChange={handleEstadoChange}
          fullWidth={false}
          size="sm"
        />
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors whitespace-nowrap"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
