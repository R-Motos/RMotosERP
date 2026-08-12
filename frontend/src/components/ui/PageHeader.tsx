import * as React from 'react'
import { cn } from '@/utils/classNames'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

/**
 * PageHeader - Encabezado de página estandarizado.
 * 
 * @prop title - Título
 * @prop description - Descripción
 * @prop breadcrumbs - Array de breadcrumbs { label, href? }
 * @prop actions - Acciones del header
 */
interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          items={breadcrumbs.map(item => ({
            label: item.label,
            href: item.href,
          }))}
          className="mb-3"
        />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
