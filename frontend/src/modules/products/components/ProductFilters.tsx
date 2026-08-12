import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { ProductoFilter } from '../types/product'

interface ProductFiltersProps {
  filters: ProductoFilter
  onFiltersChange: (filters: ProductoFilter) => void
  marcas: Array<{ id: number; nombre: string }>
  categorias: Array<{ id: number; nombre: string }>
  etiquetas: Array<{ id: number; nombre: string }>
}

export function ProductFilters({ filters, onFiltersChange, marcas, categorias, etiquetas }: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, q: e.target.value, page: 1 })
  }, [filters, onFiltersChange])

  const handleEstadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, estado: (e.target.value as ProductoFilter['estado']) || undefined, page: 1 })
  }, [filters, onFiltersChange])

  const handleMarcaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, marca_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })
  }, [filters, onFiltersChange])

  const handleCategoriaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, categoria_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })
  }, [filters, onFiltersChange])

  const handleEtiquetaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, etiqueta_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })
  }, [filters, onFiltersChange])

  const handleOrderByChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, order_by: e.target.value, page: 1 })
  }, [filters, onFiltersChange])

  const handleClear = useCallback(() => {
    onFiltersChange({ page: 1, size: 20, order_by: 'id', q: '', estado: undefined, marca_id: undefined, categoria_id: undefined, etiqueta_id: undefined })
    setShowFilters(false)
  }, [onFiltersChange])

  const hasActiveFilters = filters.q || filters.estado || filters.marca_id || filters.categoria_id || filters.etiqueta_id

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, SKU o código de barras..."
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
            options={[{ value: '', label: 'Todos los estados' }, { value: 'publicado', label: 'Publicado' }, { value: 'pendiente', label: 'Pendiente' }, { value: 'inactivo', label: 'Inactivo' }]}
            value={filters.estado || ''}
            onChange={handleEstadoChange}
          />
          <Select
            size="sm"
            options={[{ value: '', label: 'Todas las marcas' }, ...marcas.map(m => ({ value: m.id, label: m.nombre }))]}
            value={filters.marca_id?.toString() || ''}
            onChange={handleMarcaChange}
          />
          <Select
            size="sm"
            options={[{ value: '', label: 'Todas las categorías' }, ...categorias.map(c => ({ value: c.id, label: c.nombre }))]}
            value={filters.categoria_id?.toString() || ''}
            onChange={handleCategoriaChange}
          />
          <Select
            size="sm"
            options={[{ value: '', label: 'Todas las etiquetas' }, ...etiquetas.map(e => ({ value: e.id, label: e.nombre }))]}
            value={filters.etiqueta_id?.toString() || ''}
            onChange={handleEtiquetaChange}
          />
          <Select
            size="sm"
            options={[{ value: 'id', label: 'ID' }, { value: 'nombre', label: 'Nombre' }, { value: 'precio_venta', label: 'Precio de venta' }, { value: 'precio_compra', label: 'Precio de compra' }, { value: 'cantidad_disponible', label: 'Stock' }, { value: 'created_at', label: 'Fecha de creación' }]}
            value={filters.order_by || 'id'}
            onChange={handleOrderByChange}
          />
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={handleClear}
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
