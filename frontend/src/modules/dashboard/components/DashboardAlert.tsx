import { AlertTriangle } from 'lucide-react'

interface DashboardAlertProps {
  count: number
}

export function DashboardAlert({ count }: DashboardAlertProps) {
  if (count === 0) return null

  return (
    <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center gap-3">
      <AlertTriangle size={20} className="text-error-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-error-700">
          {count} producto{count !== 1 ? 's' : ''} sin stock
        </p>
        <p className="text-xs text-error-600 mt-0.5">
          Revisa el inventario para reponer productos agotados
        </p>
      </div>
    </div>
  )
}
