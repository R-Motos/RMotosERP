import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { InventoryInfo } from '@/modules/inventory/components/InventoryInfo'
import { InventoryStock } from '@/modules/inventory/components/InventoryStock'
import { InventoryStatusBadge } from '@/modules/inventory/components/InventoryStatusBadge'
import { useInventoryDetail } from '@/modules/inventory/hooks/useInventoryDetail'
import type { InventarioEstadoVisual } from '@/modules/inventory/types/inventory'

export function InventoryDetail() {
  const { productoId } = useParams<{ productoId: string }>()
  const navigate = useNavigate()

  const { product, isLoading, error, refetch } = useInventoryDetail(Number(productoId))

  const handleBack = useCallback(() => {
    navigate('/inventario')
  }, [navigate])

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={refetch} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
        </div>
      </div>
    )
  }

  if (isLoading || !product) {
    return (
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const estadoVisual: InventarioEstadoVisual = product.cantidad_disponible <= 0 ? 'sin_stock' : product.cantidad_disponible <= product.stock_minimo ? 'bajo' : 'normal'

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg width="20" height="20" className="text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{product.nombre}</h1>
            <p className="text-sm text-neutral-500 mt-1">Detalle de inventario</p>
          </div>
        </div>
        <InventoryStatusBadge estado={estadoVisual} />
      </div>

      <InventoryInfo product={product} />

      <InventoryStock product={product} />

      <div className="mt-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Volver al inventario
        </button>
      </div>
    </div>
  )
}
