import { ProductImage } from './ProductImage'
import { Badge } from '@/components/ui/Badge'
import type { Producto } from '../types/product'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ProductViewProps {
  product: Producto
  onClose?: () => void
}

export function ProductView({ product, onClose }: ProductViewProps) {
  const estadoBadge = product.estado === 'publicado'
    ? { label: 'Publicado', variant: 'success' as const }
    : product.estado === 'pendiente'
      ? { label: 'Pendiente', variant: 'warning' as const }
      : { label: 'Inactivo', variant: 'error' as const }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <ProductImage src={product.imagen} name={product.nombre} size="lg" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900">{product.nombre}</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {product.sku ? `SKU: ${product.sku}` : 'Sin SKU'}
          </p>
          {product.codigo_barras && (
            <p className="text-sm text-neutral-500">Código de barras: {product.codigo_barras}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant={estadoBadge.variant}>{estadoBadge.label}</Badge>
            {product.marca && (
              <Badge variant="default">{product.marca.nombre}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Precio de compra</p>
          <p className="text-sm font-semibold text-neutral-900">{formatCOP(product.precio_compra)}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Precio de venta</p>
          <p className="text-sm font-semibold text-neutral-900">{formatCOP(product.precio_venta)}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Stock disponible</p>
          <p className="text-sm font-semibold text-neutral-900">{product.cantidad_disponible}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Stock mínimo</p>
          <p className="text-sm font-semibold text-neutral-900">{product.stock_minimo}</p>
        </div>
      </div>

      {(product.categorias.length > 0 || product.etiquetas.length > 0) && (
        <div className="space-y-2">
          {product.categorias.length > 0 && (
            <div>
              <p className="text-xs text-neutral-500 mb-1">Categorías</p>
              <div className="flex flex-wrap gap-1">
                {product.categorias.map(c => (
                  <Badge key={c.id} variant="default">{c.nombre}</Badge>
                ))}
              </div>
            </div>
          )}
          {product.etiquetas.length > 0 && (
            <div>
              <p className="text-xs text-neutral-500 mb-1">Etiquetas</p>
              <div className="flex flex-wrap gap-1">
                {product.etiquetas.map(e => (
                  <Badge key={e.id} variant="default">{e.nombre}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
