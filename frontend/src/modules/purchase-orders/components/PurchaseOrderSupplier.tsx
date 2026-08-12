import { useState, useCallback, useEffect } from 'react'
import { Select } from '@/components/ui/Select'
import { supplierService } from '@/modules/suppliers/services/supplier.service'
import type { Proveedor } from '@/modules/suppliers/types/supplier'

interface PurchaseOrderSupplierProps {
  proveedorId: number | null
  onProveedorChange: (proveedorId: number | null) => void
  disabled?: boolean
}

export function PurchaseOrderSupplier({ proveedorId, onProveedorChange, disabled }: PurchaseOrderSupplierProps) {
  const [suppliers, setSuppliers] = useState<Proveedor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await supplierService.list({ estado: 'activo' })
        setSuppliers(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onProveedorChange(e.target.value ? Number(e.target.value) : null)
  }, [onProveedorChange])

  return (
    <Select
      label="Proveedor"
      options={[
        { value: '', label: isLoading ? 'Cargando proveedores...' : 'Seleccionar proveedor' },
        ...suppliers.map(s => ({ value: s.id, label: s.nombre })),
      ]}
      value={proveedorId?.toString() || ''}
      onChange={handleChange}
      disabled={disabled || isLoading}
    />
  )
}
