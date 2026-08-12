import { useCallback } from 'react'
import { DashboardHeader } from '@/modules/dashboard/components/DashboardHeader'
import { DashboardStats } from '@/modules/dashboard/components/DashboardStats'
import { DashboardSalesChart } from '@/modules/dashboard/components/DashboardSalesChart'
import { DashboardLowStock } from '@/modules/dashboard/components/DashboardLowStock'
import { DashboardAlert } from '@/modules/dashboard/components/DashboardAlert'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'

export function Dashboard() {
  const { resumen, productos, isLoading, error, refetch } = useDashboard()

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

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

  const outOfStockCount = productos?.bajo_stock.filter(p => p.cantidad_disponible <= 0).length || 0

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <DashboardHeader onRefresh={handleRefresh} isLoading={isLoading} />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-neutral-100 rounded-xl animate-pulse" />
            <div className="h-80 bg-neutral-100 rounded-xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <DashboardAlert count={outOfStockCount} />

          {resumen && <DashboardStats resumen={resumen} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DashboardSalesChart data={productos?.mas_vendidos || []} />
            <DashboardLowStock products={productos?.bajo_stock || []} />
          </div>
        </>
      )}
    </div>
  )
}
