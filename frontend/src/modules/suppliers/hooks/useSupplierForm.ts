import { useState, useCallback } from 'react'
import { supplierService } from '../services/supplier.service'
import type { Proveedor, ProveedorCreate, ProveedorUpdate } from '../types/supplier'

interface UseSupplierFormReturn {
  isOpen: boolean
  editingSupplier: Proveedor | null
  isLoading: boolean
  openCreate: () => void
  openEdit: (supplier: Proveedor) => void
  close: () => void
  submit: (data: ProveedorCreate | ProveedorUpdate) => Promise<void>
  changeState: (id: number, estado: Proveedor['estado']) => Promise<void>
}

export function useSupplierForm(onSuccess: () => void): UseSupplierFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Proveedor | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingSupplier(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((supplier: Proveedor) => {
    setEditingSupplier(supplier)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingSupplier(null)
  }, [])

  const submit = useCallback(async (data: ProveedorCreate | ProveedorUpdate) => {
    setIsLoading(true)
    try {
      if (editingSupplier) {
        await supplierService.update(editingSupplier.id, data as ProveedorUpdate)
      } else {
        await supplierService.create(data as ProveedorCreate)
      }
      close()
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [editingSupplier, close, onSuccess])

  const changeState = useCallback(async (id: number, estado: Proveedor['estado']) => {
    setIsLoading(true)
    try {
      await supplierService.changeState(id, estado)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  return {
    isOpen,
    editingSupplier,
    isLoading,
    openCreate,
    openEdit,
    close,
    submit,
    changeState,
  }
}
