import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { VentaFilter } from '../types/sale'

interface SaleFiltersProps {
  filters: VentaFilter
  onFiltersChange: (key: keyof VentaFilter, value: VentaFilter[keyof VentaFilter]) => void
  onClear: () => void
  hasActiveFilters: boolean
  usuarios: { id: number; nombre: string }[]
}

export function SaleFilters({ filters, onFiltersChange, onClear, hasActiveFilters, usuarios }: SaleFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange('q', e.target.value)
  }, [onFiltersChange])

  const handleEstadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange('estado', (e.target.value as VentaFilter['estado']) || undefined)
  }, [onFiltersChange])

  const handleUsuarioChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onFiltersChange('usuario_id', value ? Number(value) : undefined)
  }, [onFiltersChange])

  const handleFechaInicioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange('fecha_inicio', e.target.value || undefined)
  }, [onFiltersChange])

  const handleFechaFinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange('fecha_fin', e.target.value || undefined)
  }, [onFiltersChange])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Buscar por número o cliente..."
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Select
            size="sm"
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'completada', label: 'Completada' },
              { value: 'anulada', label: 'Anulada' },
            ]}
            value={filters.estado || ''}
            onChange={handleEstadoChange}
          />
          <Select
            size="sm"
            options={[
              { value: '', label: 'Todos los usuarios' },
              ...usuarios.map(u => ({ value: String(u.id), label: u.nombre })),
            ]}
            value={filters.usuario_id ? String(filters.usuario_id) : ''}
            onChange={handleUsuarioChange}
          />
          <input
            type="date"
            value={filters.fecha_inicio || ''}
            onChange={handleFechaInicioChange}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
            placeholder="Fecha inicio"
          />
          <input
            type="date"
            value={filters.fecha_fin || ''}
            onChange={handleFechaFinChange}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
            placeholder="Fecha fin"
          />
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={onClear}
                className="px-3 py-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
