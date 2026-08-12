import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Etiqueta, EtiquetaCreate, EtiquetaUpdate } from '../types/tag'

interface TagFormProps {
  tag?: Etiqueta | null
  onSubmit: (data: EtiquetaCreate | EtiquetaUpdate) => void
  onCancel: () => void
  isLoading: boolean
}

export function TagForm({ tag, onSubmit, onCancel, isLoading }: TagFormProps) {
  const [nombre, setNombre] = useState(tag?.nombre || '')

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
        placeholder="Nombre de la etiqueta"
        required
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {tag ? 'Guardar cambios' : 'Crear etiqueta'}
        </Button>
      </div>
    </form>
  )
}
