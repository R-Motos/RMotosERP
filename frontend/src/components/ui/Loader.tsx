import { cn } from '@/utils/classNames'

/**
 * Loader - Indicador de carga centrado.
 * 
 * @prop size - sm | md | lg
 * @prop text - Texto opcional
 */
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'border-4 border-neutral-200 border-t-primary-600 rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-neutral-600">{text}</p>}
    </div>
  )
}
