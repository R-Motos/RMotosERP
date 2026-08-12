import { Select } from '@/components/ui/Select'
import type { AuditFilter, AuditAccion } from '../types/audit'
import { ACCIONES } from '../hooks/useAuditFilters'

interface AuditFiltersProps {
  filters: AuditFilter
  onFiltersChange: (filters: AuditFilter) => void
}

const MODULOS = [
  { value: '', label: 'Todos los módulos' },
  { value: 'productos', label: 'Productos' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'clientes', label: 'Clientes' },
  { value: 'proveedores', label: 'Proveedores' },
  { value: 'ordenes_compra', label: 'Órdenes de Compra' },
  { value: 'recepciones_compra', label: 'Recepciones' },
  { value: 'usuarios', label: 'Usuarios' },
  { value: 'movimientos', label: 'Movimientos' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'auth', label: 'Autenticación' },
]

export function AuditFilters({ filters, onFiltersChange }: AuditFiltersProps) {
  const handleModuloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, modulo: e.target.value || undefined, page: 1 })
  }

  const handleAccionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, accion: (e.target.value as AuditAccion) || undefined, page: 1 })
  }

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, fecha_inicio: e.target.value || undefined, page: 1 })
  }

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, fecha_fin: e.target.value || undefined, page: 1 })
  }

  const handleClear = () => {
    onFiltersChange({ page: 1, size: 20 })
  }

  const hasActiveFilters = !!(filters.modulo || filters.accion || filters.fecha_inicio || filters.fecha_fin)

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <Select
        options={MODULOS}
        value={filters.modulo || ''}
        onChange={handleModuloChange}
      />
      <Select
        options={[
          { value: '', label: 'Todas las acciones' },
          ...ACCIONES.map(a => ({ value: a, label: a })),
        ]}
        value={filters.accion || ''}
        onChange={handleAccionChange}
      />
      <input
        type="date"
        value={filters.fecha_inicio || ''}
        onChange={handleFechaInicioChange}
        className="px-3 py-2 text-sm border border-neutral-200 rounded-lg"
        placeholder="Fecha desde"
      />
      <input
        type="date"
        value={filters.fecha_fin || ''}
        onChange={handleFechaFinChange}
        className="px-3 py-2 text-sm border border-neutral-200 rounded-lg"
        placeholder="Fecha hasta"
      />
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
