import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/classNames'
import { Button } from '@/components/ui/Button'

/**
 * Modal - Diálogo modal para acciones confirmatorias o formularios.
 * 
 * @prop isOpen - Control de visibilidad
 * @prop onClose - Callback de cierre
 * @prop title - Título del modal
 * @prop description - Subtítulo
 * @prop footer - Acciones del pie
 * @prop size - sm | md | lg
 */
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col',
          sizeClasses[size]
        )}
      >
        {(title || description) && (
          <div className="px-6 py-4 border-b border-neutral-200">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-neutral-500">{description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={<X size={18} />}
                onClick={onClose}
                aria-label="Cerrar"
              />
            </div>
          </div>
        )}
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
