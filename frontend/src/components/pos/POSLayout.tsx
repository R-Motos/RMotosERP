import { ReactNode } from 'react'
import { cn } from '@/utils/classNames'

interface POSLayoutProps {
  children: ReactNode
  className?: string
}

export function POSLayout({ children, className }: POSLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-neutral-50', className)}>
      {children}
    </div>
  )
}
