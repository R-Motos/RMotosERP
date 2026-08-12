import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/classNames'
import { ChevronRight } from 'lucide-react'

/**
 * Breadcrumb - Navegación de jerarquía.
 * 
 * @prop items - Array de items { label, href? }
 */
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight size={14} className="text-neutral-400" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
