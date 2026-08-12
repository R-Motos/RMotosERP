import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/classNames'

interface DashboardHeaderProps {
  onRefresh: () => void
  isLoading: boolean
}

export function DashboardHeader({ onRefresh, isLoading }: DashboardHeaderProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const date = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{greeting}</h1>
        <p className="text-sm text-neutral-500 mt-1 capitalize">{date}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
        <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
      </Button>
    </div>
  )
}
