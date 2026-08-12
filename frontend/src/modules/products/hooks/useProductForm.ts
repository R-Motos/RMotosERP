import { useState, useCallback } from 'react'
import { productService } from '../services/product.service'
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/product'

interface UseProductFormReturn {
  isOpen: boolean
  editingProduct: Producto | null
  readOnly: boolean
  isLoading: boolean
  openCreate: () => void
  openEdit: (product: Producto) => void
  openView: (product: Producto) => void
  close: () => void
  submit: (data: ProductoCreate | ProductoUpdate) => Promise<void>
  remove: (id: number) => Promise<void>
  updateState: (id: number, estado: Producto['estado']) => Promise<void>
}

export function useProductForm(onSuccess: () => void): UseProductFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingProduct(null)
    setReadOnly(false)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((product: Producto) => {
    setEditingProduct(product)
    setReadOnly(false)
    setIsOpen(true)
  }, [])

  const openView = useCallback((product: Producto) => {
    setEditingProduct(product)
    setReadOnly(true)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingProduct(null)
    setReadOnly(false)
  }, [])

  const submit = useCallback(async (data: ProductoCreate | ProductoUpdate) => {
    setIsLoading(true)
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data as ProductoUpdate)
      } else {
        await productService.create(data as ProductoCreate)
      }
      close()
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [editingProduct, close, onSuccess])

  const remove = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      await productService.delete(id)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  const changeState = useCallback(async (id: number, estado: Producto['estado']) => {
    setIsLoading(true)
    try {
      await productService.changeState(id, estado)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  return {
    isOpen,
    editingProduct,
    readOnly,
    isLoading,
    openCreate,
    openEdit,
    openView,
    close,
    submit,
    remove,
    updateState: changeState,
  }
}
