import * as React from 'react'
import { cn } from '@/utils/classNames'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * StatCard - Métrica con tendencia.
 * 
 * @prop title - Título de la métrica
 * @prop value - Valor principal
 * @prop trend - Objeto con valor y label
 * @prop icon - Icono decorativo
 */
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  trend?: {
    value: number
    label?: string
  }
  icon?: React.ReactNode
  tooltip?: string
}

export function StatCard({
  className,
  trend,
  title,
  value,
  icon,
  tooltip,
  ...props
}: StatCardProps) {
  const TrendIcon =
    trend && trend.value > 0
      ? TrendingUp
      : trend && trend.value < 0
        ? TrendingDown
        : Minus

  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 p-6 bg-white',
        trend && trend.value > 0 && 'border-l-4 border-l-success-500',
        trend && trend.value < 0 && 'border-l-4 border-l-error-500',
        trend && trend.value === 0 && 'border-l-4 border-l-neutral-300',
        !trend && 'border-l-4 border-l-neutral-300',
        className
      )}
      title={tooltip}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendIcon
                size={16}
                className={
                  trend.value > 0
                    ? 'text-success-600'
                    : trend.value < 0
                      ? 'text-error-600'
                      : 'text-neutral-400'
                }
              />
              <span
                className={
                  trend.value > 0
                    ? 'text-success-600'
                    : trend.value < 0
                      ? 'text-error-600'
                      : 'text-neutral-500'
                }
              >
                {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span className="text-neutral-400">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-neutral-50 rounded-lg text-neutral-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
