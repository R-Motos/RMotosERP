import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * Textarea - Campo de texto multilínea.
 * 
 * @prop variant - default | error
 * @prop size - sm | md | lg
 * @prop label - Texto del label
 * @prop error - Mensaje de error
 */
const textareaVariants = cva(
  'w-full px-3 py-2.5 rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-400 transition-all duration-fast focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed resize-vertical',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
  error?: string
}

export function Textarea({
  className,
  variant,
  size,
  label,
  error,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(textareaVariants({ variant: error ? 'error' : variant, size }), className)}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
    </div>
  )
}
