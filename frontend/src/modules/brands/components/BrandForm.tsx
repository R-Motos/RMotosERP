import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Marca, MarcaCreate, MarcaUpdate } from '../types/brand'

interface BrandFormProps {
  brand?: Marca | null
  onSubmit: (data: MarcaCreate | MarcaUpdate) => void
  onCancel: () => void
  isLoading: boolean
}

export function BrandForm({ brand, onSubmit, onCancel, isLoading }: BrandFormProps) {
  const [nombre, setNombre] = useState(brand?.nombre || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ nombre })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la marca"
        required
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {brand ? 'Guardar cambios' : 'Crear marca'}
        </Button>
      </div>
    </form>
  )
}
