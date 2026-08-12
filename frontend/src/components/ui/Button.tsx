import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'
import { Spinner } from '@/components/ui/Spinner'

/**
 * Button - Botón principal para acciones.
 * 
 * @prop variant - primary | secondary | ghost | danger
 * @prop size - sm | md | lg
 * @prop loading - Muestra spinner inline
 * @prop icon - Icono a la izquierda
 * @prop disabled - Estado deshabilitado
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 min-h-tactile min-w-tactile',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300',
        ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm rounded-md',
        md: 'px-4 py-2.5 text-sm rounded-lg',
        lg: 'px-6 py-3 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  className,
  variant,
  size,
  loading,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {!loading && icon}
      {children}
    </button>
  )
}
