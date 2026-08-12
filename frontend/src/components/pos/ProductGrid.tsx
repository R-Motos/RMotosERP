import { ReactNode, forwardRef } from 'react'
import { cn } from '@/utils/classNames'

interface ProductGridProps {
  children: ReactNode
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

export const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(
  ({ children, className, onKeyDown }: ProductGridProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3',
          className
        )}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    )
  }
)

ProductGrid.displayName = 'ProductGrid'
