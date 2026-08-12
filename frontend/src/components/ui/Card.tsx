import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * Card - Contenedor de contenido relacionado.
 * 
 * @prop variant - default | elevated | outlined
 * @prop padding - none | sm | md | lg
 * @prop header - Cabecera personalizada
 * @prop footer - Pie personalizado
 */
const cardVariants = cva(
  'bg-white rounded-xl border border-neutral-200 shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        elevated: 'shadow-md',
        outlined: 'border-2 shadow-none',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Card({
  className,
  variant,
  padding,
  header,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {header && (
        <div className="px-6 py-4 border-b border-neutral-200">
          {header}
        </div>
      )}
      <div className={cn(!padding && 'p-6')}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  )
}
