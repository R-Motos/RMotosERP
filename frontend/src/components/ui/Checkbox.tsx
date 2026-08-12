import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * Checkbox - Selección múltiple booleana.
 * 
 * @prop variant - default | error
 * @prop size - sm | md | lg
 * @prop label - Texto del label
 * @prop error - Mensaje de error
 */
const checkboxVariants = cva(
  'h-5 w-5 rounded border-2 transition-all duration-fast flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 bg-white checked:bg-primary-600 checked:border-primary-600',
        error: 'border-error-500 checked:bg-error-600 checked:border-error-600',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  error?: string
}

export function Checkbox({
  className,
  variant,
  size,
  label,
  error,
  id,
  checked,
  ...props
}: CheckboxProps) {
  const checkboxId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex items-start gap-2.5">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn('peer sr-only', className)}
          checked={checked}
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={cn(
            checkboxVariants({ variant: error ? 'error' : variant, size }),
            'cursor-pointer peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-100 peer-focus-visible:ring-offset-2'
          )}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </label>
      </div>
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-neutral-700 cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  )
}
