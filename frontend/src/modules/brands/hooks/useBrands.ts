import { useState, useCallback } from 'react'
import { brandService } from '../services/brand.service'
import type { Marca, MarcaFilter, MarcaCreate, MarcaUpdate } from '../types/brand'

interface UseBrandsReturn {
  brands: Marca[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: MarcaFilter) => Promise<void>
  reset: () => void
}

export function useBrands(): UseBrandsReturn {
  const [brands, setBrands] = useState<Marca[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (_filters?: MarcaFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await brandService.list()
      setBrands(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar marcas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setBrands([])
    setError(null)
  }, [])

  return {
    brands,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}

interface UseBrandFormReturn {
  isOpen: boolean
  editingBrand: Marca | null
  isLoading: boolean
  openCreate: () => void
  openEdit: (brand: Marca) => void
  close: () => void
  submit: (data: MarcaCreate | MarcaUpdate) => Promise<Marca>
}

export function useBrandForm(onSuccess: () => void): UseBrandFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Marca | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingBrand(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((brand: Marca) => {
    setEditingBrand(brand)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingBrand(null)
  }, [])

  const submit = useCallback(async (data: MarcaCreate | MarcaUpdate) => {
    setIsLoading(true)
    try {
      let brand: Marca
      if (editingBrand) {
        brand = await brandService.update(editingBrand.id, data as MarcaUpdate)
      } else {
        brand = await brandService.create(data as MarcaCreate)
      }
      onSuccess()
      close()
      return brand
    } finally {
      setIsLoading(false)
    }
  }, [editingBrand, onSuccess, close])

  return {
    isOpen,
    editingBrand,
    isLoading,
    openCreate,
    openEdit,
    close,
    submit,
  }
}
