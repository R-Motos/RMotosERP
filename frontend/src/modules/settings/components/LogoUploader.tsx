import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Upload, X } from 'lucide-react'
import type { SystemConfig } from '../types/settings'

interface LogoUploaderProps {
  config: SystemConfig
  onUpdate: (data: Partial<SystemConfig>) => void
  isLoading?: boolean
}

export function LogoUploader({ config, onUpdate, isLoading }: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(config.logo)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onUpdate({ logo: result })
    }
    reader.readAsDataURL(file)
  }, [onUpdate])

  const handleRemove = useCallback(() => {
    setPreview(null)
    onUpdate({ logo: null })
  }, [onUpdate])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700">Logo</label>
      
      {preview ? (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 flex items-center justify-center">
            <img src={preview} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <Button variant="secondary" size="sm" onClick={handleRemove} disabled={isLoading}>
            <X size={16} />
            Eliminar
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            <Button variant="secondary" size="sm" icon={<Upload size={16} />}>
              Subir logo
            </Button>
          </label>
          <span className="text-xs text-neutral-500">PNG, JPG, SVG (máx. 2MB)</span>
        </div>
      )}
    </div>
  )
}
