import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'
import { X } from 'lucide-react'

/**
 * Chip - Tag o etiqueta removable.
 * 
 * @prop variant - default | primary | success | warning | error
 * @prop size - sm | md | lg
 * @prop onRemove - Callback para eliminar
 * @prop icon - Icono a la izquierda
 */
const chipVariants = cva(
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-fast',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
        success: 'bg-success-100 text-success-700 hover:bg-success-200',
        warning: 'bg-warning-100 text-warning-700 hover:bg-warning-200',
        error: 'bg-error-100 text-error-700 hover:bg-error-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void
  icon?: React.ReactNode
}

export function Chip({
  className,
  variant,
  size,
  onRemove,
  icon,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(chipVariants({ variant, size }), className)}
      {...props}
    >
      {icon}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-neutral-100 p-0.5 transition-colors"
          aria-label="Eliminar"
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}
