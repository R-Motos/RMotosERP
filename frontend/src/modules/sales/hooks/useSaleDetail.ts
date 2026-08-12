import { useState, useCallback, useEffect } from 'react'
import { saleService } from '../services/sale.service'
import { clientService } from '@/modules/clients/services/client.service'
import { productService } from '@/modules/products/services/product.service'
import { authStorage } from '@/services/auth.service'
import type { Venta, VentaDetalle } from '../types/sale'
import type { Cliente } from '@/modules/clients/types/client'
import type { Producto } from '@/modules/products/types/product'

interface UseSaleDetailReturn {
  sale: (Venta & { cliente_nombre?: string; usuario_nombre?: string; detalles: (VentaDetalle & { producto_nombre?: string; producto_sku?: string | null; producto_imagen?: string | null })[] }) | null
  cliente: Cliente | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useSaleDetail(id: number): UseSaleDetailReturn {
  const [sale, setSale] = useState<(Venta & { cliente_nombre?: string; usuario_nombre?: string; detalles: (VentaDetalle & { producto_nombre?: string; producto_sku?: string | null; producto_imagen?: string | null })[] }) | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await saleService.get(id)
      const currentUser = authStorage.getUser()
      const usuarioNombre = currentUser && currentUser.id === data.usuario_id ? currentUser.nombre : undefined

      let clienteData: Cliente | null = null
      if (data.cliente_id) {
        try {
          clienteData = await clientService.get(data.cliente_id)
        } catch {
          // ignore
        }
      }

      const productosMap = new Map<number, Producto>()
      if (data.detalles.length > 0) {
        try {
          const results = await Promise.allSettled(
            data.detalles.map(d => productService.get(d.producto_id))
          )
          results.forEach((result, index) => {
            const productoId = data.detalles[index].producto_id
            if (result.status === 'fulfilled' && result.value) {
              productosMap.set(productoId, result.value)
            }
          })
        } catch {
          // ignore - productos opcionales
        }
      }

      setSale({
        ...data,
        cliente_nombre: clienteData?.nombre,
        usuario_nombre: usuarioNombre,
        detalles: data.detalles.map(d => {
          const producto = productosMap.get(d.producto_id)
          return {
            ...d,
            producto_nombre: producto?.nombre || `Producto #${d.producto_id}`,
            producto_sku: producto?.sku,
            producto_imagen: producto?.imagen,
          }
        }),
      })
      setCliente(clienteData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la venta')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return {
    sale,
    cliente,
    isLoading,
    error,
    refetch: fetchDetail,
  }
}
