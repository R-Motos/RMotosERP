import { useState, useCallback } from 'react'
import { categoryService } from '../services/category.service'
import type { Categoria, CategoriaFilter, CategoriaCreate, CategoriaUpdate } from '../types/category'

interface UseCategoriesReturn {
  categories: Categoria[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: CategoriaFilter) => Promise<void>
  reset: () => void
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (_filters?: CategoriaFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await categoryService.list()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setCategories([])
    setError(null)
  }, [])

  return {
    categories,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}

interface UseCategoryFormReturn {
  isOpen: boolean
  editingCategory: Categoria | null
  isLoading: boolean
  openCreate: () => void
  openEdit: (category: Categoria) => void
  close: () => void
  submit: (data: CategoriaCreate | CategoriaUpdate) => Promise<Categoria>
}

export function useCategoryForm(onSuccess: () => void): UseCategoryFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingCategory(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((category: Categoria) => {
    setEditingCategory(category)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingCategory(null)
  }, [])

  const submit = useCallback(async (data: CategoriaCreate | CategoriaUpdate) => {
    setIsLoading(true)
    try {
      let category: Categoria
      if (editingCategory) {
        category = await categoryService.update(editingCategory.id, data as CategoriaUpdate)
      } else {
        category = await categoryService.create(data as CategoriaCreate)
      }
      onSuccess()
      close()
      return category
    } finally {
      setIsLoading(false)
    }
  }, [editingCategory, onSuccess, close])

  return {
    isOpen,
    editingCategory,
    isLoading,
    openCreate,
    openEdit,
    close,
    submit,
  }
}
