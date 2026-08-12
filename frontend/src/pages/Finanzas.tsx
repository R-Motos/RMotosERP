import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { ArrowDown, ArrowUp, Wallet, Package, TrendingUp, AlertTriangle } from 'lucide-react'
import { FinanzasTable } from '@/modules/finanzas/components/FinanzasTable'
import { useFinanzas } from '@/modules/finanzas/hooks/useFinanzas'
import { financaService } from '@/modules/finanzas/services/finanza.service'

function formatCurrency(value: number): string {
  const abs = Math.abs(value)
  const rounded = Math.round(abs)
  let formatted: string

  if (rounded >= 1_000_000) {
    formatted = `${(rounded / 1_000_000).toFixed(0)}M`
  } else if (rounded >= 1_000) {
    formatted = `${(rounded / 1_000).toFixed(0)}K`
  } else {
    formatted = rounded.toLocaleString('es-CO')
  }

  const prefix = value < 0 ? '-' : ''
  return `${prefix}$${formatted}`
}

export function Finanzas() {
  const { addToast } = useToast()
  const { movimientos, total, overview, isLoading, error, executeFetch } = useFinanzas()
  const [showForm, setShowForm] = useState(false)
  const [tooltip, setTooltip] = useState<{ title: string; value: string } | null>(null)
  const [formData, setFormData] = useState<{
    tipo: 'ingreso' | 'egreso'
    concepto: string
    descripcion: string
    monto: string
    fecha: string
  }>({
    tipo: 'ingreso',
    concepto: '',
    descripcion: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    executeFetch()
  }, [executeFetch])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await financaService.create({
        tipo: formData.tipo,
        concepto: formData.concepto,
        descripcion: formData.descripcion || undefined,
        monto: parseFloat(formData.monto),
        fecha: formData.fecha,
        usuario_id: 1,
      })
      setShowForm(false)
      setFormData({ tipo: 'ingreso', concepto: '', descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] })
      await executeFetch()
      addToast({ type: 'success', message: 'Movimiento financiero creado' })
    } catch {
      addToast({ type: 'error', message: 'Error al crear movimiento financiero' })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, executeFetch, addToast])

  const ingresosTotal = overview?.total_ingresos ?? 0
  const egresosTotal = overview?.total_egresos ?? 0
  const bal = overview?.balance ?? 0
  const inventarioValor = overview?.inventario_valor ?? 0
  const profitEsperado = overview?.profit_esperado ?? 0

  const formatFull = (value: number) => `S/ ${Math.round(value).toLocaleString('es-CO')}`

  const isPositive = bal >= 0
  const isProfitPositive = profitEsperado >= 0

  const handleCardClick = (title: string, value: number) => {
    setTooltip({ title, value: formatFull(value) })
  }

  const closeTooltip = () => {
    setTooltip(null)
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Finanzas"
        description="Resumen financiero, inventario y profit esperado"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Nuevo Movimiento'}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={() => executeFetch()} className="text-sm text-primary-600 hover:text-primary-700 mt-1">
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div onClick={() => handleCardClick('Total Ingresos', ingresosTotal)}>
          <StatCard
            title="Total Ingresos"
            value={formatCurrency(ingresosTotal)}
            trend={{ value: 0, label: 'este período' }}
            icon={<ArrowUp size={20} />}
            tooltip={formatFull(ingresosTotal)}
          />
        </div>
        <div onClick={() => handleCardClick('Total Egresos', egresosTotal)}>
          <StatCard
            title="Total Egresos"
            value={formatCurrency(egresosTotal)}
            trend={{ value: 0, label: 'este período' }}
            icon={<ArrowDown size={20} />}
            tooltip={formatFull(egresosTotal)}
          />
        </div>
        <div onClick={() => handleCardClick('Balance', bal)}>
          <StatCard
            title="Balance"
            value={formatCurrency(bal)}
            trend={{ value: isPositive ? 1 : -1, label: isPositive ? 'positivo' : 'negativo' }}
            icon={<Wallet size={20} />}
            className={isPositive ? 'border-l-4 border-l-success-500' : 'border-l-4 border-l-error-500'}
            tooltip={formatFull(bal)}
          />
        </div>
        <div onClick={() => handleCardClick('Valor Inventario', inventarioValor)}>
          <StatCard
            title="Valor Inventario"
            value={formatCurrency(inventarioValor)}
            trend={{ value: 0, label: 'en stock' }}
            icon={<Package size={20} />}
            tooltip={formatFull(inventarioValor)}
          />
        </div>
        <div onClick={() => handleCardClick('Profit Esperado', profitEsperado)}>
          <StatCard
            title="Profit Esperado"
            value={formatCurrency(profitEsperado)}
            trend={{ value: isProfitPositive ? 1 : -1, label: isProfitPositive ? 'ganancia' : 'pérdida' }}
            icon={isProfitPositive ? <TrendingUp size={20} /> : <AlertTriangle size={20} />}
            className={isProfitPositive ? 'border-l-4 border-l-success-500' : 'border-l-4 border-l-error-500'}
            tooltip={formatFull(profitEsperado)}
          />
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeTooltip}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">{tooltip.title}</h3>
            <p className="text-2xl font-bold text-neutral-900">{tooltip.value}</p>
            <button
              onClick={closeTooltip}
              className="mt-4 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm text-neutral-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {!isPositive && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} className="text-error-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-error-700">Balance negativo</p>
            <p className="text-xs text-error-600">Los egresos superan a los ingresos. Revisar movimientos.</p>
          </div>
        </div>
      )}

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Desglose de Ingresos</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-600">Ventas</span>
                    <span className="text-xs font-semibold text-success-700">{formatCurrency(overview.ingresos_venta)}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success-500 rounded-full transition-all duration-500"
                      style={{ width: `${ingresosTotal > 0 ? Math.round((overview.ingresos_venta / ingresosTotal) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-0.5 text-right">
                    {ingresosTotal > 0 ? Math.round((overview.ingresos_venta / ingresosTotal) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-600">Manual</span>
                    <span className="text-xs font-semibold text-neutral-700">{formatCurrency(overview.ingresos_manual)}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-400 rounded-full transition-all duration-500"
                      style={{ width: `${ingresosTotal > 0 ? Math.round((overview.ingresos_manual / ingresosTotal) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-0.5 text-right">
                    {ingresosTotal > 0 ? Math.round((overview.ingresos_manual / ingresosTotal) * 100) : 0}%
                  </p>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-900">Total Ingresos</span>
                  <span className="text-sm font-bold text-neutral-900">{formatCurrency(ingresosTotal)}</span>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Desglose de Egresos</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-600">Compras</span>
                    <span className="text-xs font-semibold text-error-700">{formatCurrency(overview.egresos_compra)}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-error-500 rounded-full transition-all duration-500"
                      style={{ width: `${egresosTotal > 0 ? Math.round((overview.egresos_compra / egresosTotal) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-0.5 text-right">
                    {egresosTotal > 0 ? Math.round((overview.egresos_compra / egresosTotal) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-600">Manual</span>
                    <span className="text-xs font-semibold text-neutral-700">{formatCurrency(overview.egresos_manual)}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-400 rounded-full transition-all duration-500"
                      style={{ width: `${egresosTotal > 0 ? Math.round((overview.egresos_manual / egresosTotal) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-0.5 text-right">
                    {egresosTotal > 0 ? Math.round((overview.egresos_manual / egresosTotal) * 100) : 0}%
                  </p>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-900">Total Egresos</span>
                  <span className="text-sm font-bold text-neutral-900">{formatCurrency(egresosTotal)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showForm && (
        <Card>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'ingreso' | 'egreso' })}
                  options={[
                    { value: 'ingreso', label: 'Ingreso' },
                    { value: 'egreso', label: 'Egreso' },
                  ]}
                />
                <Input
                  label="Concepto"
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  required
                />
                <Input
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
                <Input
                  label="Monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  required
                />
                <Input
                  label="Fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" loading={isSubmitting}>Guardar Movimiento</Button>
            </form>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : movimientos.length === 0 ? (
        <EmptyState
          title="Sin movimientos financieros"
          description="No se encontraron movimientos financieros registrados"
        />
      ) : (
        <>
          <FinanzasTable data={movimientos} />
          <div className="text-sm text-neutral-500">
            Últimos {movimientos.length} de {total} movimientos
          </div>
        </>
      )}
    </div>
  )
}