import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Plus } from 'lucide-react'
import type { Producto, ProductoCreate, ProductoUpdate, MarcaOption, CategoriaOption, EtiquetaOption } from '../types/product'

interface ProductFormProps {
  product: ProductoCreate | ProductoUpdate | null
  marcas: MarcaOption[]
  categorias: CategoriaOption[]
  etiquetas: EtiquetaOption[]
  onSubmit: (data: ProductoCreate | ProductoUpdate) => void
  onCancel: () => void
  isLoading: boolean
  readOnly?: boolean
}

const ESTADO_OPTIONS = [
  { value: 'publicado', label: 'Publicado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function ProductForm({ product, marcas, categorias, etiquetas, onSubmit, onCancel, isLoading, readOnly }: ProductFormProps) {
  const categoriaIdsFromProduct = product && 'categorias' in product ? (product as Producto).categorias.map(c => c.id) : (product as ProductoCreate | ProductoUpdate | null)?.categoria_ids || []
  const etiquetaIdsFromProduct = product && 'etiquetas' in product ? (product as Producto).etiquetas.map(e => e.id) : (product as ProductoCreate | ProductoUpdate | null)?.etiqueta_ids || []

  const [formData, setFormData] = useState<ProductoCreate>({
    nombre: product?.nombre || '',
    imagen: product?.imagen || '',
    sku: product?.sku || '',
    codigo_barras: product?.codigo_barras || '',
    precio_compra: product?.precio_compra || 0,
    precio_venta: product?.precio_venta || 0,
    gestionar_inventario: product?.gestionar_inventario ?? true,
    cantidad_disponible: product?.cantidad_disponible || 0,
    stock_minimo: product?.stock_minimo || 0,
    marca_id: product?.marca_id || undefined,
    categoria_ids: categoriaIdsFromProduct,
    etiqueta_ids: etiquetaIdsFromProduct,
    estado: product?.estado || 'pendiente',
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

  const renderMultiSelectField = (
    label: string,
    selectedIds: number[],
    options: Array<{ id: number; nombre: string }>,
    onChange: (ids: number[]) => void
  ) => {
    const [isAdding, setIsAdding] = useState(false)
    const availableOptions = options.filter(opt => !selectedIds.includes(opt.id))
    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id))

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
        <div className="flex flex-wrap gap-2 items-center">
          {selectedOptions.map(opt => (
            <Chip
              key={opt.id}
              variant="primary"
              size="sm"
              onRemove={() => onChange(selectedIds.filter(id => id !== opt.id))}
            >
              {opt.nombre}
            </Chip>
          ))}
          {availableOptions.length > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => setIsAdding(!isAdding)}
            >
              <Plus size={14} />
            </Button>
          )}
        </div>
        {isAdding && (
          <div className="flex flex-wrap gap-2 pt-2">
            {availableOptions.map(opt => (
              <Button
                key={opt.id}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onChange([...selectedIds, opt.id])
                  setIsAdding(false)
                }}
              >
                {opt.nombre}
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} required readOnly={readOnly} />
      <Input label="Imagen (URL)" value={formData.imagen || ''} onChange={e => handleChange('imagen', e.target.value || null)} placeholder="https://..." readOnly={readOnly} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="SKU" value={formData.sku || ''} onChange={e => handleChange('sku', e.target.value || null)} readOnly={readOnly} />
        <Input label="Código de barras" value={formData.codigo_barras || ''} onChange={e => handleChange('codigo_barras', e.target.value || null)} readOnly={readOnly} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Precio de compra" type="number" step="0.01" value={formData.precio_compra} onChange={e => handleChange('precio_compra', parseFloat(e.target.value) || 0)} required readOnly={readOnly} />
        <Input label="Precio de venta" type="number" step="0.01" value={formData.precio_venta} onChange={e => handleChange('precio_venta', parseFloat(e.target.value) || 0)} required readOnly={readOnly} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Cantidad disponible" type="text" inputMode="decimal" value={formData.cantidad_disponible} onChange={e => handleChange('cantidad_disponible', parseFloat(e.target.value) || 0)} readOnly={readOnly} />
        <Input label="Stock mínimo" type="text" inputMode="decimal" value={formData.stock_minimo} onChange={e => handleChange('stock_minimo', parseFloat(e.target.value) || 0)} readOnly={readOnly} />
      </div>
      <Select
        label="Marca"
        options={[{ value: '', label: 'Sin marca' }, ...marcas.map(m => ({ value: m.id, label: m.nombre }))]}
        value={formData.marca_id?.toString() || ''}
        onChange={e => handleChange('marca_id', e.target.value ? Number(e.target.value) : undefined)}
        disabled={readOnly}
      />
      {renderMultiSelectField('Categorías', formData.categoria_ids || [], categorias, (ids) => handleChange('categoria_ids', ids))}
      {renderMultiSelectField('Etiquetas', formData.etiqueta_ids || [], etiquetas, (ids) => handleChange('etiqueta_ids', ids))}
      <Select
        label="Estado"
        options={ESTADO_OPTIONS}
        value={formData.estado}
        onChange={e => handleChange('estado', e.target.value)}
        disabled={readOnly}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="gestionar_inventario"
          checked={formData.gestionar_inventario}
          onChange={e => handleChange('gestionar_inventario', e.target.checked)}
          className="rounded border-neutral-300"
          disabled={readOnly}
        />
        <label htmlFor="gestionar_inventario" className="text-sm text-neutral-700">Gestionar inventario</label>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={readOnly}>{readOnly ? 'Cerrar' : 'Cancelar'}</Button>
        {!readOnly && (
          <Button variant="primary" type="submit" loading={isLoading}>Guardar</Button>
        )}
      </div>
    </form>
  )
}
