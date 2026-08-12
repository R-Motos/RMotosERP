import { cn } from '@/utils/classNames'

/**
 * Skeleton - Placeholder durante carga.
 * 
 * @prop variant - text | circular | rectangular
 * @prop width - Ancho custom
 * @prop height - Alto custom
 */
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn('animate-pulse bg-neutral-200', variantClasses[variant], className)}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
      }}
    />
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height={24} className="flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={20} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200">
      <Skeleton variant="text" width="60%" height={20} className="mb-4" />
      <Skeleton variant="text" width="40%" height={32} className="mb-2" />
      <Skeleton variant="text" width="30%" height={16} />
    </div>
  )
}
