import { useState, useCallback } from 'react'
import { supplierService } from '../services/supplier.service'
import type { Proveedor, ProveedorFilter } from '../types/supplier'

interface UseSuppliersReturn {
  suppliers: Proveedor[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: ProveedorFilter) => Promise<void>
  reset: () => void
}

export function useSuppliers(): UseSuppliersReturn {
  const [suppliers, setSuppliers] = useState<Proveedor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: ProveedorFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await supplierService.list(filters)
      setSuppliers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proveedores')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSuppliers([])
    setError(null)
  }, [])

  return {
    suppliers,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}
