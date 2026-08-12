import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * MetricCard - Métrica con descripción.
 * 
 * @prop size - sm | md | lg
 * @prop label - Label de la métrica
 * @prop value - Valor principal
 * @prop unit - Unidad
 * @prop description - Descripción
 * @prop chart - Gráfico opcional
 */
const metricCardVariants = cva(
  'rounded-xl border border-neutral-200 p-6 bg-white',
  {
    variants: {
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  label: string
  value: string | number
  unit?: string
  description?: string
  chart?: React.ReactNode
}

export function MetricCard({
  className,
  size,
  label,
  value,
  unit,
  description,
  chart,
  ...props
}: MetricCardProps) {
  return (
    <div className={cn(metricCardVariants({ size }), className)} {...props}>
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
        {unit && (
          <span className="text-sm text-neutral-500">{unit}</span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      )}
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  )
}
