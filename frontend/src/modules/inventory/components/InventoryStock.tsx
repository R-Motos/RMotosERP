import { InventoryStockCard } from './InventoryStockCard'
import type { Producto } from '../types/inventory'

interface InventoryStockProps {
  product: Producto
}

export function InventoryStock({ product }: InventoryStockProps) {
  const stockMinimo = Number(product.stock_minimo)
  const stockDisponible = Number(product.cantidad_disponible)

  const estadoVisual = stockDisponible <= 0 ? 'error' : stockDisponible <= stockMinimo ? 'warning' : 'success'

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-neutral-900 mb-3">Stock</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InventoryStockCard label="Stock actual" value={stockDisponible} variant={estadoVisual} />
        <InventoryStockCard label="Stock mínimo" value={stockMinimo} variant="default" />
        <InventoryStockCard label="Stock disponible" value={stockDisponible} variant={estadoVisual} />
      </div>
    </div>
  )
}
