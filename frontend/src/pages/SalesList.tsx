import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/layout/ToastContainer'
import { SaleToolbar } from '@/modules/sales/components/SaleToolbar'
import { SaleFilters } from '@/modules/sales/components/SaleFilters'
import { SaleTable } from '@/modules/sales/components/SaleTable'
import { SaleEmptyState } from '@/modules/sales/components/SaleEmptyState'
import { saleService } from '@/modules/sales/services/sale.service'
import { userService } from '@/modules/users/services/user.service'
import { Button } from '@/components/ui/Button'
import type { Venta, VentaFilter } from '@/modules/sales/types/sale'
import type { User } from '@/modules/users/types/user'

export function SalesList() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [sales, setSales] = useState<Venta[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [cancelTarget, setCancelTarget] = useState<Venta | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [filters, setFilters] = useState<VentaFilter>({})

  useEffect(() => {
    userService.list({ estado: 'activo' }).then(setUsuarios).catch(() => setUsuarios([]))
  }, [])

  const executeFetch = useCallback(async (currentFilters: VentaFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await saleService.list(currentFilters)

      if (Array.isArray(data)) {
        const total = data.reduce((sum, venta) => sum + Number(venta.total || 0), 0)
        setSales(data)
        setTotal(total)
      } else {
        setSales(Array.isArray(data.items) ? data.items : [])
        setTotal(typeof data.total === 'number' ? data.total : 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ventas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFilterChange = useCallback((key: keyof VentaFilter, value: VentaFilter[keyof VentaFilter]) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      return next
    })
  }, [])

  const handleClear = useCallback(() => {
    setFilters({})
  }, [])

  const hasActiveFilters = !!(filters.estado || filters.fecha_inicio || filters.fecha_fin || filters.usuario_id || filters.q)

  const handleRowClick = useCallback((sale: Venta) => {
    navigate(`/ventas/${sale.id}`)
  }, [navigate])

  const handleCancelClick = useCallback((sale: Venta) => {
    setCancelTarget(sale)
  }, [])

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget) return
    setIsCancelling(true)
    try {
      await saleService.cancel(cancelTarget.id)
      addToast({ type: 'success', message: `Venta ${cancelTarget.numero} anulada` })
      setCancelTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al anular la venta' })
    } finally {
      setIsCancelling(false)
    }
  }, [cancelTarget, addToast, executeFetch, filters])

  return (
    <div className="p-4 md:p-6">
      <SaleToolbar
        onRefresh={handleRefresh}
        onCreate={() => navigate('/pos')}
        isLoading={isLoading}
        total={total}
        cantidadVentas={sales.length}
      />

      <SaleFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        onClear={handleClear}
        hasActiveFilters={hasActiveFilters}
        usuarios={usuarios}
      />

      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={() => executeFetch(filters)} className="text-sm text-primary-600 hover:text-primary-700 mt-1">
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <SaleEmptyState onCreate={() => navigate('/pos')} />
      ) : (
        <SaleTable
          data={sales}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          onCancel={handleCancelClick}
        />
      )}

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Anular venta</h3>
            <p className="text-sm text-neutral-600 mb-4">
              ¿Estás seguro de que deseas anular la venta {cancelTarget.numero}? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setCancelTarget(null)} disabled={isCancelling}>
                No, mantener
              </Button>
              <Button variant="primary" onClick={handleCancelConfirm} loading={isCancelling}>
                Sí, anular
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
