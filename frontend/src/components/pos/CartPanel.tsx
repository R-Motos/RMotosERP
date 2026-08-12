import { ReactNode } from 'react'
import { cn } from '@/utils/classNames'

interface CartPanelProps {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function CartPanel({ header, children, footer, className }: CartPanelProps) {
  return (
    <aside
      className={cn(
        'bg-white border-l border-neutral-200 flex flex-col h-[calc(100vh-64px)]',
        className
      )}
    >
      {header && (
        <div className="shrink-0 px-5 py-4 border-b border-neutral-200">
          {header}
        </div>
      )}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-5 py-3">
          {children}
        </div>
      </div>
      {footer && (
        <div className="shrink-0">
          {footer}
        </div>
      )}
    </aside>
  )
}
