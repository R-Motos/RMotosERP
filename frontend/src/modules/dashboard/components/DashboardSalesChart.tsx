import { Card } from '@/components/ui/Card'
import type { ProductoMovimiento } from '../types/dashboard'

interface DashboardSalesChartProps {
  data: ProductoMovimiento[]
}

export function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card header={<h3 className="text-sm font-semibold text-neutral-900">Productos más vendidos</h3>}>
        <div className="h-64 flex items-center justify-center text-neutral-500 text-sm">
          Sin datos de ventas
        </div>
      </Card>
    )
  }

  const maxSold = Math.max(...data.map(d => d.total_vendido))
  const chartData = data.slice(0, 8)

  return (
    <Card header={<h3 className="text-sm font-semibold text-neutral-900">Productos más vendidos</h3>}>
      <div className="h-64">
        <div className="flex flex-col justify-between gap-2 h-full">
          {chartData.map((item, index) => {
            const widthPercent = maxSold > 0 ? (item.total_vendido / maxSold) * 100 : 0
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <p className="text-sm font-medium text-neutral-900 truncate" title={item.nombre}>
                    {item.nombre}
                  </p>
                </div>
                <div className="flex-1 bg-neutral-100 rounded h-6 relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-primary-500 rounded transition-all duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-neutral-900">{item.total_vendido}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
