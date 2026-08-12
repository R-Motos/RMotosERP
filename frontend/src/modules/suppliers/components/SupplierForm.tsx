import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { ProveedorCreate, ProveedorUpdate } from '../types/supplier'

interface SupplierFormProps {
  supplier: ProveedorCreate | ProveedorUpdate | null
  onSubmit: (data: ProveedorCreate | ProveedorUpdate) => void
  onCancel: () => void
  isLoading: boolean
}

const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function SupplierForm({ supplier, onSubmit, onCancel, isLoading }: SupplierFormProps) {
  const [formData, setFormData] = useState<ProveedorCreate>({
    nombre: supplier?.nombre || '',
    nit: supplier?.nit || '',
    contacto: supplier?.contacto || '',
    telefono: supplier?.telefono || '',
    email: supplier?.email || '',
    direccion: supplier?.direccion || '',
    ciudad: supplier?.ciudad || '',
    observaciones: supplier?.observaciones || '',
    estado: supplier?.estado || 'activo',
  })

  const handleChange = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }, [formData, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} required />
      <Input label="NIT" value={formData.nit || ''} onChange={e => handleChange('nit', e.target.value || null)} placeholder="123456789" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Contacto" value={formData.contacto || ''} onChange={e => handleChange('contacto', e.target.value || null)} />
        <Input label="Teléfono" value={formData.telefono || ''} onChange={e => handleChange('telefono', e.target.value || null)} />
      </div>
      <Input label="Email" type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value || null)} placeholder="proveedor@email.com" />
      <Input label="Dirección" value={formData.direccion || ''} onChange={e => handleChange('direccion', e.target.value || null)} />
      <Input label="Ciudad" value={formData.ciudad || ''} onChange={e => handleChange('ciudad', e.target.value || null)} />
      <Input label="Observaciones" value={formData.observaciones || ''} onChange={e => handleChange('observaciones', e.target.value || null)} />
      <Select
        label="Estado"
        options={ESTADO_OPTIONS}
        value={formData.estado}
        onChange={e => handleChange('estado', e.target.value)}
      />
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={isLoading}>Guardar</Button>
      </div>
    </form>
  )
}
