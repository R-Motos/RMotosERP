import { ReactNode, forwardRef } from 'react'
import { cn } from '@/utils/classNames'
import { Button } from '@/components/ui/Button'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ProductCardProps {
  image?: ReactNode
  name: string
  sku?: string
  price: number
  onAdd?: () => void
  className?: string
  gestionarInventario?: boolean
  sinStock?: boolean
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ image, name, sku, price, onAdd, className, gestionarInventario = true, sinStock = false }: ProductCardProps, ref) => {
    const numericPrice = typeof price === 'number' ? price : Number(price || 0)
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col',
          'hover:shadow-md hover:border-neutral-300',
          'active:scale-[0.98]',
          'transition-all duration-normal',
          onAdd && 'cursor-pointer',
          className
        )}
        onClick={onAdd}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onAdd?.()
          }
        }}
        tabIndex={onAdd ? 0 : undefined}
        role={onAdd ? 'button' : undefined}
      >
        {image && (
          <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center overflow-hidden">
            {image}
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug">{name}</h3>
          {sku && (
            <p className="text-xs text-neutral-500 mt-1 font-mono">SKU: {sku}</p>
          )}
          {(sku || !gestionarInventario || sinStock) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {!gestionarInventario && (
                <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                  Por pedido
                </span>
              )}
              {gestionarInventario && sinStock && (
                <span className="inline-flex rounded-full border border-error-200 bg-error-50 px-2 py-0.5 text-[10px] font-medium text-error-700">
                  Sin stock
                </span>
              )}
            </div>
          )}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <span className="text-base font-semibold text-neutral-900">
              {formatCOP(numericPrice)}
            </span>
            {onAdd && (
              <Button
                variant="primary"
                size="sm"
                icon={<span className="text-lg leading-none">+</span>}
                onClick={e => {
                  e.stopPropagation()
                  if (gestionarInventario && !sinStock) {
                    onAdd()
                  }
                }}
                className={cn('shrink-0', (!gestionarInventario || sinStock) && 'opacity-50 cursor-not-allowed')}
                disabled={!gestionarInventario || sinStock}
              >
                Agregar
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
)

ProductCard.displayName = 'ProductCard'
