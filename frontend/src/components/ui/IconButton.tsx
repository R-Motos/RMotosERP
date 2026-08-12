import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * IconButton - Botón con icono para acciones compactas.
 * 
 * @prop variant - primary | secondary | ghost | danger
 * @prop size - sm | md | lg
 * @prop icon - Nodo de icono (requerido)
 * @prop aria-label - Accesibilidad (requerido)
 */
const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300',
        ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800',
      },
      size: {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
)

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  'aria-label': string
}

export function IconButton({
  className,
  variant,
  size,
  icon,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(iconButtonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  )
}
