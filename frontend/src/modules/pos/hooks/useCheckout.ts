import { useState, useCallback } from 'react'
import { ventaService } from '@/services/venta.service'
import { useCart } from '@/app/providers/CartProvider'
import { useToast } from '@/components/layout/ToastContainer'
import { authStorage } from '@/services/auth.service'
import type { VentaCreate } from '@/modules/sales/types/sale'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface UseCheckoutReturn {
  isProcessing: boolean
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro' | null
  setPaymentMethod: (method: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro') => void
  cashReceived: string
  setCashReceived: (value: string) => void
  cashReceivedNum: number
  change: number
  isCashValid: boolean
  handlePay: (clienteId?: number | null) => Promise<boolean>
  resetPayment: () => void
}

export function useCheckout(): UseCheckoutReturn {
  const { items, total, discount, clearCart } = useCart()
  const { addToast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta' | 'otro' | null>(null)
  const [cashReceived, setCashReceived] = useState('')
  const usuarioId = Number(authStorage.getUser()?.id) || 1

  const cashReceivedNum = parseFloat(cashReceived) || 0
  const isCashValid = paymentMethod !== 'efectivo' || cashReceivedNum >= total
  const change = paymentMethod === 'efectivo' ? Math.max(0, cashReceivedNum - total) : 0

  const handlePay = useCallback(async (clienteId: number | null = null): Promise<boolean> => {
    if (items.length === 0 || !paymentMethod) return false
    if (paymentMethod === 'efectivo' && !isCashValid) return false

    setIsProcessing(true)
    try {
      const detalles = items.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        descuento: item.descuento,
      }))

      const venta: VentaCreate = {
        usuario_id: usuarioId,
        cliente_id: clienteId,
        metodo_pago: paymentMethod,
        estado: 'completada',
        descuento: discount,
        detalles,
      }

      await ventaService.create(venta)
      addToast({ type: 'success', message: `Venta registrada - Total: ${formatCOP(total)}` })
      clearCart()
      setPaymentMethod(null)
      setCashReceived('')
      return true
    } catch (err) {
      addToast({ type: 'error', message: 'Error al registrar la venta' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [items, paymentMethod, isCashValid, total, discount, clearCart, addToast, usuarioId])

  const resetPayment = useCallback(() => {
    setPaymentMethod(null)
    setCashReceived('')
  }, [])

  return {
    isProcessing,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    cashReceivedNum,
    change,
    isCashValid,
    handlePay,
    resetPayment,
  }
}
