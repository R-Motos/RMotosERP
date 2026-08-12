import { useState, useCallback, useEffect } from 'react'
import { productService } from '../services/product.service'
import type { Producto, ProductoFilter } from '../types/product'
import type { MarcaOption, CategoriaOption, EtiquetaOption } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Producto[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marcas, setMarcas] = useState<MarcaOption[]>([])
  const [categorias, setCategorias] = useState<CategoriaOption[]>([])
  const [etiquetas, setEtiquetas] = useState<EtiquetaOption[]>([])

  const fetchProducts = useCallback(async (filters: ProductoFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productService.list(filters)
      setProducts(data.items)
      setTotal(data.total)
      setPage(data.page)
      setSize(data.size)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [marcasRes, categoriasRes, etiquetasRes] = await Promise.all([
        productService.listMarcas(),
        productService.listCategorias(),
        productService.listEtiquetas(),
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
    executeFetch: fetchProducts,
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
