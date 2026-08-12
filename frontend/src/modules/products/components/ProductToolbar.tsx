import { Plus, RefreshCw, Download, Upload, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/classNames'
import { useToast } from '@/components/layout/ToastContainer'
import { useRef } from 'react'
import { productService } from '@/modules/products/services/product.service'

interface ProductToolbarProps {
  onRefresh: () => void
  onCreate: () => void
  isLoading: boolean
  total: number
}

export function ProductToolbar({ onRefresh, onCreate, isLoading, total }: ProductToolbarProps) {
  const { addToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const downloadTemplate = async () => {
    try {
      const content = await productService.getCsvTemplate()
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'productos_template.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      addToast({ type: 'success', message: 'Plantilla CSV descargada' })
    } catch {
      addToast({ type: 'error', message: 'Error al descargar plantilla' })
    }
  }

  const exportProducts = async () => {
    try {
      const content = await productService.exportCsv()
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'productos_export.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      addToast({ type: 'success', message: 'Productos exportados a CSV' })
    } catch {
      addToast({ type: 'error', message: 'Error al exportar productos' })
    }
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await productService.importCsv(file)
      addToast({
        type: result.errors.length > 0 ? 'warning' : 'success',
        message: `Importación completada: ${result.created} creados, ${result.updated} actualizados`,
      })
      if (result.errors.length > 0) {
        console.warn('Errores de importación:', result.errors)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al importar productos'
      addToast({ type: 'error', message })
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Productos</h1>
        <p className="text-sm text-neutral-500 mt-1">{total} productos</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
        </Button>
        <Button variant="primary" size="sm" onClick={onCreate}>
          <Plus size={16} />
          Nuevo producto
        </Button>
        <Button variant="secondary" size="sm" onClick={downloadTemplate} disabled={isLoading}>
          <FileSpreadsheet size={16} />
          Plantilla
        </Button>
        <Button variant="secondary" size="sm" onClick={exportProducts} disabled={isLoading}>
          <Download size={16} />
          Exportar
        </Button>
        <input
          ref={fileInputRef}
          id="csv-import-input"
          type="file"
          accept=".csv"
          onChange={handleFileImport}
          className="hidden"
        />
        <Button variant="secondary" size="sm" disabled={isLoading} type="button" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} />
          Importar
        </Button>
      </div>
    </div>
  )
}
