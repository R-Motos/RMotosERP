import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

const inputVariants = cva(
  'w-full px-3 py-2.5 min-h-tactile rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-400 transition-all duration-fast focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border-neutral-300',
        error: 'border-error-500 focus:border-error-500 focus:ring-error-100',
        success: 'border-success-500 focus:border-success-500 focus:ring-success-100',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-sm',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, leftIcon, rightIcon, id, ...props }: InputProps, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ variant: error ? 'error' : variant, size }),
              !!leftIcon && 'pl-10',
              !!rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
