import { cn } from '@/utils/classNames'

interface InventoryStockCardProps {
  label: string
  value: number
  variant: 'default' | 'warning' | 'error' | 'success'
}

export function InventoryStockCard({ label, value, variant }: InventoryStockCardProps) {
  const colorClass = {
    default: 'text-neutral-900',
    warning: 'text-warning-600',
    error: 'text-error-600',
    success: 'text-success-600',
  }[variant]

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <p className={cn('text-2xl font-bold', colorClass)}>{value}</p>
    </div>
  )
}
