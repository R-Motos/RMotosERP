import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { ClienteCreate, ClienteUpdate } from '../types/client'

interface ClientFormProps {
  client: ClienteCreate | ClienteUpdate | null
  onSubmit: (data: ClienteCreate | ClienteUpdate) => void
  onCancel: () => void
  isLoading: boolean
}

const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [formData, setFormData] = useState<ClienteCreate>({
    nombre: client?.nombre || '',
    email: client?.email || '',
    telefono: client?.telefono || '',
    estado: client?.estado || 'activo',
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
      <Input label="Email" type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value || null)} placeholder="cliente@email.com" />
      <Input label="Teléfono" value={formData.telefono || ''} onChange={e => handleChange('telefono', e.target.value || null)} placeholder="999999999" />
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
