import * as React from 'react'
import { cn } from '@/utils/classNames'
import { Inbox } from 'lucide-react'

/**
 * EmptyState - Estado vacío con acción.
 * 
 * @prop title - Título
 * @prop description - Descripción
 * @prop icon - Icono custom
 * @prop action - Acción opcional
 */
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
        {icon || <Inbox size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 mb-4 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
