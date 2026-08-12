import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'
import { ChevronDown } from 'lucide-react'

/**
 * Select - Selección de opciones.
 * 
 * @prop variant - default | error
 * @prop size - sm | md | lg
 * @prop label - Texto del label
 * @prop error - Mensaje de error
 * @prop options - Array de opciones { value, label }
 */
const selectVariants = cva(
  'appearance-none px-3 py-2.5 min-h-tactile rounded-lg border bg-white text-neutral-900 transition-all duration-fast focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border-neutral-300',
        error: 'border-error-500 focus:border-error-500 focus:ring-error-100',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-sm',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: true,
    },
  }
)

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
  fullWidth?: boolean
}

export function Select({
  className,
  variant,
  size,
  label,
  error,
  options,
  id,
  fullWidth = true,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(selectVariants({ variant: error ? 'error' : variant, size, fullWidth }), className)}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
      </div>
      {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
    </div>
  )
}
