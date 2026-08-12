import { useState, useCallback, useEffect } from 'react'
import { purchaseOrderService } from '../services/purchase-order.service'
import { supplierService } from '@/modules/suppliers/services/supplier.service'
import { productService } from '@/modules/products/services/product.service'
import { authStorage } from '@/services/auth.service'
import type { Proveedor } from '@/modules/suppliers/types/supplier'
import type { Producto } from '@/modules/products/types/product'
import type { OrdenCompra, OrdenCompraDetalle } from '../types/purchase-order'

interface UsePurchaseOrderDetailReturn {
  order: (OrdenCompra & { proveedor_nombre?: string; usuario_nombre?: string; detalles: (OrdenCompraDetalle & { producto_nombre?: string })[] }) | null
  proveedor: Proveedor | null
  productos: Record<number, Producto>
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function usePurchaseOrderDetail(id: number): UsePurchaseOrderDetailReturn {
  const [order, setOrder] = useState<(OrdenCompra & { proveedor_nombre?: string; usuario_nombre?: string; detalles: (OrdenCompraDetalle & { producto_nombre?: string })[] }) | null>(null)
  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [productos, setProductos] = useState<Record<number, Producto>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await purchaseOrderService.get(id)
      const currentUser = authStorage.getUser()
      const usuarioNombre = currentUser && currentUser.id === data.usuario_id ? currentUser.nombre : undefined

      let proveedorData: Proveedor | null = null
      let productosMap: Record<number, Producto> = {}

      try {
        proveedorData = await supplierService.get(data.proveedor_id)
      } catch {
        // ignore
      }

      const productoPromises = data.detalles.map(d => productService.get(d.producto_id))
      try {
        const productoResults = await Promise.all(productoPromises)
        productoResults.forEach((p, i) => {
          if (p) {
            productosMap[data.detalles[i].producto_id] = p
          }
        })
      } catch {
        // ignore individual product fetch errors
      }

      setOrder({
        ...data,
        proveedor_nombre: proveedorData?.nombre,
        usuario_nombre: usuarioNombre,
        detalles: data.detalles.map(d => ({
          ...d,
          producto_nombre: productosMap[d.producto_id]?.nombre,
        })),
      })
      setProveedor(proveedorData)
      setProductos(productosMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la orden de compra')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return {
    order,
    proveedor,
    productos,
    isLoading,
    error,
    refetch: fetchDetail,
  }
}
