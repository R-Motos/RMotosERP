import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/classNames'
import { Button } from '@/components/ui/Button'

/**
 * Drawer - Panel lateral para contenido secundario.
 * 
 * @prop isOpen - Control de visibilidad
 * @prop onClose - Callback de cierre
 * @prop title - Título del drawer
 * @prop footer - Pie personalizado
 * @prop position - left | right
 */
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  position?: 'left' | 'right'
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right',
}: DrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal flex">
      <div
        className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white shadow-xl w-full max-w-sm h-full flex flex-col',
          position === 'right' ? 'ml-auto' : 'mr-auto'
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          {title && (
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={18} />}
            onClick={onClose}
            aria-label="Cerrar"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
