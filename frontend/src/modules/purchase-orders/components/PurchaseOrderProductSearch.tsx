import { useState, useCallback, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Producto } from '@/modules/products/types/product'
import type { DetalleItem } from '../types/purchase-order'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PurchaseOrderProductSearchProps {
  detalles: DetalleItem[]
  onAddProduct: (product: Producto, detalles: DetalleItem[]) => void
  disabled?: boolean
}

export function PurchaseOrderProductSearch({ detalles, onAddProduct, disabled }: PurchaseOrderProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    try {
      const { productService } = await import('@/modules/products/services/product.service')
      const data = await productService.list({ q: searchTerm.trim(), page: 1, size: 10 })
      const existingIds = detalles.map(d => d.producto_id)
      const filtered = data.items.filter(p => !existingIds.includes(p.id))
      setResults(filtered)
      setShowResults(true)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, detalles])

  const handleAdd = useCallback((product: Producto) => {
    onAddProduct(product, detalles)
    setShowResults(false)
    setSearchTerm('')
    setResults([])
  }, [onAddProduct, detalles])

  return (
    <div className="space-y-2" ref={inputRef}>
      <label className="block text-sm font-medium text-neutral-700">Agregar producto</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar producto por nombre o SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            disabled={disabled}
          />
          {showResults && results.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {results.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAdd(product)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 text-left border-b border-neutral-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{product.nombre}</p>
                    <p className="text-xs text-neutral-500">{product.sku || 'Sin SKU'}</p>
                  </div>
                  <span className="text-sm text-neutral-600">
                    {formatCOP(product.precio_compra)}
                  </span>
                </button>
              ))}
            </div>
          )}
          {showResults && results.length === 0 && !isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg p-3">
              <p className="text-sm text-neutral-500">No se encontraron productos</p>
            </div>
          )}
        </div>
        <Button type="button" variant="secondary" onClick={handleSearch} disabled={disabled || !searchTerm.trim() || isLoading}>
          <Search size={16} />
        </Button>
      </div>
    </div>
  )
}
