import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { Cupon, CuponCreate, CuponUpdate } from '../types/coupon'

interface CouponFormProps {
  coupon: Cupon | null
  onSubmit: (data: CuponCreate | CuponUpdate) => void
  onCancel: () => void
  isLoading: boolean
  readOnly?: boolean
}

const TIPO_OPTIONS = [
  { value: 'porcentaje', label: 'Porcentaje' },
  { value: 'valor_fijo', label: 'Valor fijo' },
]

const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function CouponForm({ coupon, onSubmit, onCancel, isLoading, readOnly }: CouponFormProps) {
  const [formData, setFormData] = useState<CuponCreate>({
    codigo: coupon?.codigo || '',
    tipo: coupon?.tipo || 'porcentaje',
    valor: coupon?.valor || 0,
    fecha_inicio: coupon?.fecha_inicio?.slice(0, 10) || '',
    fecha_fin: coupon?.fecha_fin?.slice(0, 10) || '',
    uso_maximo: coupon?.uso_maximo || 1,
    estado: coupon?.estado || 'activo',
  })

  const handleChange = useCallback((field: string, value: unknown) => {
    if (readOnly) return
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [readOnly])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    onSubmit(formData)
  }, [formData, onSubmit, readOnly])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Código"
        value={formData.codigo}
        onChange={e => handleChange('codigo', e.target.value.toUpperCase())}
        required
        readOnly={readOnly}
      />
      <Select
        label="Tipo"
        options={TIPO_OPTIONS}
        value={formData.tipo}
        onChange={e => handleChange('tipo', e.target.value)}
        disabled={readOnly}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Valor"
          type="text"
          inputMode="decimal"
          value={formData.valor}
          onChange={e => handleChange('valor', Math.round(parseFloat(e.target.value) || 0))}
          required
          readOnly={readOnly}
        />
        <Input
          label="Uso máximo"
          type="text"
          inputMode="numeric"
          value={formData.uso_maximo}
          onChange={e => handleChange('uso_maximo', parseInt(e.target.value) || 0)}
          required
          readOnly={readOnly}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Fecha inicio"
          type="date"
          value={formData.fecha_inicio}
          onChange={e => handleChange('fecha_inicio', e.target.value)}
          required
          readOnly={readOnly}
        />
        <Input
          label="Fecha fin"
          type="date"
          value={formData.fecha_fin}
          onChange={e => handleChange('fecha_fin', e.target.value)}
          required
          readOnly={readOnly}
        />
      </div>
      <Select
        label="Estado"
        options={ESTADO_OPTIONS}
        value={formData.estado}
        onChange={e => handleChange('estado', e.target.value)}
        disabled={readOnly}
      />
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={readOnly}>
          {readOnly ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!readOnly && (
          <Button variant="primary" type="submit" loading={isLoading}>
            Guardar
          </Button>
        )}
      </div>
    </form>
  )
}
