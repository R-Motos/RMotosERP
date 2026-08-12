import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * Switch - Toggle booleano.
 * 
 * @prop variant - default | success | error
 * @prop size - sm | md | lg
 * @prop label - Texto del label
 */
const switchVariants = cva(
  'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 peer-checked:bg-primary-600',
        success: 'bg-neutral-200 peer-checked:bg-success-600',
        error: 'bg-neutral-200 peer-checked:bg-error-600',
      },
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof switchVariants> {
  label?: string
}

export function Switch({
  className,
  variant,
  size,
  label,
  id,
  checked,
  ...props
}: SwitchProps) {
  const switchId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={switchId}
          className="peer sr-only"
          checked={checked}
          {...props}
        />
        <label
          htmlFor={switchId}
          className={cn(switchVariants({ variant, size }), 'cursor-pointer')}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-fast',
              'peer-checked:translate-x-5',
              size === 'sm' && 'h-3 w-3 peer-checked:translate-x-4',
              size === 'lg' && 'h-5 w-5 peer-checked:translate-x-7'
            )}
          />
        </label>
      </div>
      {label && (
        <label htmlFor={switchId} className="text-sm text-neutral-700 cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  )
}
