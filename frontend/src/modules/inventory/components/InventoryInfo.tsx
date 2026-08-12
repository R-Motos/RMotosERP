import type { Producto } from '../types/inventory'

interface InventoryInfoProps {
  product: Producto
}

export function InventoryInfo({ product }: InventoryInfoProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
      <h2 className="text-sm font-semibold text-neutral-900 mb-3">Información del producto</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-neutral-500">Nombre</p>
          <p className="text-sm font-medium text-neutral-900">{product.nombre}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">SKU</p>
          <p className="text-sm font-medium text-neutral-900">{product.sku || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Código de barras</p>
          <p className="text-sm font-medium text-neutral-900">{product.codigo_barras || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Marca</p>
          <p className="text-sm font-medium text-neutral-900">{product.marca?.nombre || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Categoría</p>
          <p className="text-sm font-medium text-neutral-900">{product.categorias?.[0]?.nombre || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Estado</p>
          <p className="text-sm font-medium text-neutral-900">{product.estado}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Gestionar inventario</p>
          <p className="text-sm font-medium text-neutral-900">{product.gestionar_inventario ? 'Sí' : 'No'}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Última actualización</p>
          <p className="text-sm font-medium text-neutral-900">{new Date(product.updated_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  )
}
