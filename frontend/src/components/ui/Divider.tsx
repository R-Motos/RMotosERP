import { cn } from '@/utils/classNames'

/**
 * Divider - Separador visual.
 * 
 * @prop orientation - horizontal | vertical
 * @prop label - Texto central opcional
 */
interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  label?: string
}

export function Divider({
  orientation = 'horizontal',
  className,
  label,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('w-px h-full bg-neutral-200', className)}
        role="separator"
      />
    )
  }

  return (
    <div
      className={cn('flex items-center gap-4', className)}
      role="separator"
    >
      <div className="flex-1 h-px bg-neutral-200" />
      {label && (
        <span className="text-sm text-neutral-500">{label}</span>
      )}
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  )
}
