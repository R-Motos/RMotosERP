import { useState, useCallback, useEffect } from 'react'
import { productService } from '@/modules/products/services/product.service'
import type { Producto, ProductoFilter } from '@/modules/products/types/product'
import type { OrdenCompraDetalleCreate } from '../types/purchase-order'

interface UsePurchaseOrderProductsReturn {
  products: Producto[]
  isLoading: boolean
  searchTerm: string
  setSearchTerm: (value: string) => void
  searchProducts: () => void
  addProduct: (product: Producto, detalles: OrdenCompraDetalleCreate[]) => void
}

export function usePurchaseOrderProducts(detalles: OrdenCompraDetalleCreate[]): UsePurchaseOrderProductsReturn {
  const [products, setProducts] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const searchProducts = useCallback(async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    try {
      const filters: ProductoFilter = { q: searchTerm.trim(), page: 1, size: 10 }
      const data = await productService.list(filters)
      const existingIds = detalles.map(d => d.producto_id)
      const filtered = data.items.filter(p => !existingIds.includes(p.id))
      setProducts(filtered)
    } catch {
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, detalles])

  useEffect(() => {
    setProducts([])
  }, [searchTerm])

  const addProduct = useCallback((product: Producto, currentDetalles: OrdenCompraDetalleCreate[]) => {
    const exists = currentDetalles.some(d => d.producto_id === product.id)
    if (exists) return
    const newDetalle: OrdenCompraDetalleCreate = {
      producto_id: product.id,
      cantidad: 1,
      precio_unitario: product.precio_compra,
    }
    currentDetalles.push(newDetalle)
    setProducts([])
    setSearchTerm('')
  }, [])

  return {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    searchProducts,
    addProduct,
  }
}
