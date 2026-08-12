import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/layout/ToastContainer'
import { SaleInfo } from '@/modules/sales/components/SaleInfo'
import { SaleProducts } from '@/modules/sales/components/SaleProducts'
import { SaleTotals } from '@/modules/sales/components/SaleTotals'
import { SaleActions } from '@/modules/sales/components/SaleActions'
import { SaleStatusBadge } from '@/modules/sales/components/SaleStatusBadge'
import { useSaleDetail } from '@/modules/sales/hooks/useSaleDetail'
import { saleService } from '@/modules/sales/services/sale.service'
import { ESTADOS_INMODIFICABLES } from '@/modules/sales/types/sale'

export function SalesDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const { sale, cliente, isLoading, error, refetch } = useSaleDetail(Number(id))

  const [isCancelling, setIsCancelling] = useState(false)

  const canCancel = sale ? !ESTADOS_INMODIFICABLES.includes(sale.estado) : false

  const handleBack = useCallback(() => {
    navigate('/ventas')
  }, [navigate])

  const handleCancelClick = useCallback(async () => {
    if (!sale) return
    setIsCancelling(true)
    try {
      await saleService.cancel(sale.id)
      addToast({ type: 'success', message: `Venta ${sale.numero} anulada` })
      refetch()
    } catch {
      addToast({ type: 'error', message: 'Error al anular la venta' })
    } finally {
      setIsCancelling(false)
    }
  }, [sale, addToast, refetch])

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={refetch} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
        </div>
      </div>
    )
  }

  if (isLoading || !sale) {
    return (
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const cantidadUnidades = sale.detalles.reduce((sum, d) => sum + Number(d.cantidad), 0)

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg width="20" height="20" className="text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Venta {sale.numero}</h1>
            <p className="text-sm text-neutral-500 mt-1">Detalle de la venta</p>
          </div>
        </div>
        <SaleStatusBadge estado={sale.estado} />
      </div>

      <SaleInfo
        numero={sale.numero}
        fechaVenta={sale.fecha_venta}
        estado={sale.estado}
        clienteNombre={cliente?.nombre || sale.cliente_nombre}
        usuarioNombre={sale.usuario_nombre}
        metodoPago={sale.metodo_pago}
      />

      <SaleProducts detalles={sale.detalles} />

      <SaleTotals
        subtotal={Number(sale.subtotal)}
        descuento={Number(sale.descuento)}
        total={Number(sale.total)}
        cantidadItems={sale.detalles.length}
        cantidadUnidades={cantidadUnidades}
      />

      <div className="mt-4">
        <SaleActions
          onCancel={handleCancelClick}
          onBack={handleBack}
          canCancel={canCancel}
          isCancelling={isCancelling}
        />
      </div>
    </div>
  )
}
