import { StatCard } from '@/components/ui/StatCard'
import { Package, AlertTriangle, TrendingUp } from 'lucide-react'
import type { ResumenResponse } from '../types/dashboard'

interface DashboardStatsProps {
  resumen: ResumenResponse
}

export function DashboardStats({ resumen }: DashboardStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Productos"
        value={resumen.inventario.cantidad_productos}
        icon={<Package size={20} />}
      />
      <StatCard
        title="Valor Inventario"
        value={formatCurrency(resumen.inventario.valor_inventario)}
        icon={<Package size={20} />}
      />
      <StatCard
        title="Bajo Stock"
        value={resumen.inventario.productos_bajo_stock}
        trend={resumen.inventario.productos_bajo_stock > 0 ? { value: -100, label: 'requieren atención' } : undefined}
        icon={<AlertTriangle size={20} />}
      />
      <StatCard
        title="Total vendido"
        value={formatCurrency(resumen.ventas.total_vendido)}
        trend={resumen.ventas.total_vendido > 0 ? { value: 100, label: 'ventas registradas' } : undefined}
        icon={<TrendingUp size={20} />}
      />
    </div>
  )
}
