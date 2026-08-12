import { Card } from '@/components/ui/Card'

interface DashboardTopProductsProps {
  products: Array<{ id: number; nombre: string; total_vendido: number }>
}

export function DashboardTopProducts({ products }: DashboardTopProductsProps) {
  if (!products || products.length === 0) {
    return (
      <Card header={<h3 className="text-sm font-semibold text-neutral-900">Productos más vendidos</h3>}>
        <div className="text-center py-8 text-neutral-500 text-sm">
          Sin datos de ventas
        </div>
      </Card>
    )
  }

  const maxSold = Math.max(...products.map(p => p.total_vendido))

  return (
    <Card header={<h3 className="text-sm font-semibold text-neutral-900">Productos más vendidos</h3>}>
      <div className="space-y-4">
        {products.slice(0, 5).map((product, index) => {
          const percentage = maxSold > 0 ? (product.total_vendido / maxSold) * 100 : 0

          return (
            <div key={product.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-medium text-neutral-500 w-4">{index + 1}</span>
                  <p className="text-sm font-medium text-neutral-900 truncate">{product.nombre}</p>
                </div>
                <span className="text-sm text-neutral-600 ml-2">{product.total_vendido}</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden ml-7">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
