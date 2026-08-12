import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Toast - Notificación temporal.
 * 
 * @prop variant - success | error | warning | info
 * @prop message - Texto del mensaje
 * @prop onClose - Callback de cierre
 */
const toastVariants = cva(
  'flex items-start gap-3 p-4 rounded-xl shadow-lg border',
  {
    variants: {
      variant: {
        success: 'bg-white border-success-200',
        error: 'bg-white border-error-200',
        warning: 'bg-white border-warning-200',
        info: 'bg-white border-primary-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const iconColorMap = {
  success: 'text-success-600',
  error: 'text-error-600',
  warning: 'text-warning-600',
  info: 'text-primary-600',
}

interface ToastProps
  extends VariantProps<typeof toastVariants> {
  message: string
  onClose: () => void
}

export function Toast({ variant = 'info', message, onClose }: ToastProps) {
  const Icon = iconMap[variant || 'info']
  const iconColor = iconColorMap[variant || 'info']

  return (
      <div className={cn(toastVariants({ variant }))}>
      <Icon size={20} className={cn('mt-0.5 flex-shrink-0', iconColor)} />
      <p className="flex-1 text-sm text-neutral-700">{message}</p>
      <Button
        variant="ghost"
        size="sm"
        icon={<X size={16} />}
        onClick={onClose}
        aria-label="Cerrar"
      />
    </div>
  )
}
