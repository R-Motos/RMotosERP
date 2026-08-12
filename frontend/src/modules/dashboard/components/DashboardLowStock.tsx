import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ProductoBajoStock } from '../types/dashboard'

interface DashboardLowStockProps {
  products: ProductoBajoStock[]
}

export function DashboardLowStock({ products }: DashboardLowStockProps) {
  const lowStock = products.filter(p => p.cantidad_disponible <= p.stock_minimo)

  if (lowStock.length === 0) {
    return (
      <Card header={<h3 className="text-sm font-semibold text-neutral-900">Stock bajo</h3>}>
        <div className="text-center py-8 text-neutral-500 text-sm">
          Todos los productos tienen stock suficiente
        </div>
      </Card>
    )
  }

  return (
    <Card header={<h3 className="text-sm font-semibold text-neutral-900">Stock bajo</h3>}>
      <div className="space-y-3">
        {lowStock.slice(0, 5).map(product => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{product.nombre}</p>
              <p className="text-xs text-neutral-500">
                {product.cantidad_disponible} / {product.stock_minimo} min
              </p>
            </div>
            <div className="ml-3">
              {product.cantidad_disponible <= 0 ? (
                <span className="text-xs font-medium text-error-600">Sin stock</span>
              ) : (
                <span className="text-xs font-medium text-warning-600">Bajo</span>
              )}
            </div>
          </div>
        ))}
        {lowStock.length > 5 && (
          <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = '/inventario'}>
            Ver todos ({lowStock.length})
          </Button>
        )}
      </div>
    </Card>
  )
}
