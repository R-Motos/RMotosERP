import { useState, useCallback, useMemo, useEffect } from 'react'
import { httpClient } from '@/services/httpClient'
import { productService } from '@/modules/products/services/product.service'
import type { Producto } from '@/modules/products/types/product'

interface UsePOSReturn {
  products: Producto[]
  searchQuery: string
  setSearchQuery: (value: string) => void
  activeCategory: number | null
  setActiveCategory: (id: number | null) => void
  marcaId: number | null
  setMarcaId: (id: number | null) => void
  etiquetaId: number | null
  setEtiquetaId: (id: number | null) => void
  filteredProducts: Producto[]
  isLoading: boolean
  isFetchingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refreshProducts: () => void
  categories: Array<{ id: number; nombre: string }>
  marcas: Array<{ id: number; nombre: string }>
  etiquetas: Array<{ id: number; nombre: string }>
}

export function usePOS(): UsePOSReturn {
  const [products, setProducts] = useState<Producto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Array<{ id: number; nombre: string }>>([])
  const [marcas, setMarcas] = useState<Array<{ id: number; nombre: string }>>([])
  const [etiquetas, setEtiquetas] = useState<Array<{ id: number; nombre: string }>>([])
  const [marcaId, setMarcaId] = useState<number | null>(null)
  const [etiquetaId, setEtiquetaId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchProducts = useCallback(async (pageNum = 1) => {
    if (pageNum === 1) {
      setIsLoading(true)
      setProducts([])
    } else {
      setIsFetchingMore(true)
    }
    setError(null)
    try {
      const data = await productService.list({
        page: pageNum,
        size: 40,
        marca_id: marcaId ?? undefined,
        etiqueta_id: etiquetaId ?? undefined,
      })
      if (pageNum === 1) {
        setProducts(data.items)
      } else {
        setProducts(prev => [...prev, ...data.items])
      }
      setTotalPages(Math.ceil(data.total / data.size))
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [marcaId, etiquetaId])

  const loadMore = useCallback(() => {
    if (page < totalPages && !isFetchingMore) {
      fetchProducts(page + 1)
    }
  }, [page, totalPages, isFetchingMore, fetchProducts])

  const refreshProducts = useCallback(() => {
    fetchProducts(1)
  }, [fetchProducts])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await httpClient.get<Array<{ id: number; nombre: string }>>('/pos/categorias')
      setCategories(data)
    } catch {
      // ignore
    }
  }, [])

  const fetchMarcas = useCallback(async () => {
    try {
      const data = await httpClient.get<Array<{ id: number; nombre: string }>>('/pos/marcas')
      setMarcas(data)
    } catch {
      // ignore
    }
  }, [])

  const fetchEtiquetas = useCallback(async () => {
    try {
      const data = await httpClient.get<Array<{ id: number; nombre: string }>>('/pos/etiquetas')
      setEtiquetas(data)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchProducts(1)
  }, [fetchProducts, marcaId, etiquetaId])

  useEffect(() => {
    fetchCategories()
    fetchMarcas()
    fetchEtiquetas()
  }, [fetchCategories, fetchMarcas, fetchEtiquetas])

  const filteredProducts = useMemo(() => {
    let result = products

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.codigo_barras?.toLowerCase().includes(term)
      )
    }

    if (activeCategory !== null) {
      result = result.filter(p =>
        p.categorias.some(c => c.id === activeCategory)
      )
    }

    if (marcaId !== null) {
      result = result.filter(p => p.marca?.id === marcaId)
    }

    if (etiquetaId !== null) {
      result = result.filter(p => p.etiquetas.some(e => e.id === etiquetaId))
    }

    return result
  }, [products, searchQuery, activeCategory, marcaId, etiquetaId])

  const hasMore = page < totalPages

  return {
    products,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    marcaId,
    setMarcaId,
    etiquetaId,
    setEtiquetaId,
    filteredProducts,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    loadMore,
    refreshProducts,
    categories,
    marcas,
    etiquetas,
  }
}
