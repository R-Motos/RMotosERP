import { useState, useCallback, useEffect } from 'react'
import { inventoryService } from '../services/inventory.service'
import type { Producto, ProductoFilter, MarcaOption, CategoriaOption, EtiquetaOption } from '../types/inventory'

export function useInventory() {
  const [products, setProducts] = useState<Producto[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marcas, setMarcas] = useState<MarcaOption[]>([])
  const [categorias, setCategorias] = useState<CategoriaOption[]>([])
  const [etiquetas, setEtiquetas] = useState<EtiquetaOption[]>([])

  const fetchInventory = useCallback(async (filters: ProductoFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await inventoryService.list(filters)
      setProducts(data.items)
      setTotal(data.total)
      setPage(data.page)
      setSize(data.size)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [marcasRes, categoriasRes, etiquetasRes] = await Promise.all([
        inventoryService.listMarcas(),
        inventoryService.listCategorias(),
        inventoryService.listEtiquetas(),
      ])
      setMarcas(marcasRes)
      setCategorias(categoriasRes)
      setEtiquetas(etiquetasRes)
    } catch {
      // ignore - filter options are optional
    }
  }, [])

  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])

  return {
    products,
    total,
    page,
    size,
    isLoading,
    error,
    executeFetch: fetchInventory,
    reset: () => {
      setProducts([])
      setTotal(0)
      setPage(1)
      setSize(20)
      setError(null)
    },
    marcas,
    categorias,
    etiquetas,
    fetchFilterOptions,
  }
}
