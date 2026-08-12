import { Button } from '@/components/ui/Button'

interface RestoreSettingsProps {
  onRestore: () => void
  isRestoring: boolean
  selectedFile: File | null
  onFileChange: (file: File | null) => void
}

export function RestoreSettings({ onRestore, isRestoring, selectedFile, onFileChange }: RestoreSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600">
          Restaura la base de datos desde un archivo de backup.
        </p>
        <p className="text-xs text-error-600 mt-1">
          Esta acción reemplazará todos los datos actuales.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".db,.sqlite,.sqlite3"
          onChange={e => onFileChange(e.target.files?.[0] || null)}
          disabled={isRestoring}
          className="text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {selectedFile && (
          <span className="text-sm text-neutral-500">{selectedFile.name}</span>
        )}
      </div>

      <Button 
        variant="primary" 
        onClick={onRestore} 
        loading={isRestoring}
        disabled={!selectedFile}
      >
        Restaurar Base de Datos
      </Button>
    </div>
  )
}
