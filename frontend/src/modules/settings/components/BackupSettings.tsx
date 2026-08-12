import { Button } from '@/components/ui/Button'

interface BackupSettingsProps {
  onBackup: () => void
  isBackingUp: boolean
  lastBackup?: string
}

export function BackupSettings({ onBackup, isBackingUp, lastBackup }: BackupSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600">
          Crea una copia de seguridad completa de la base de datos.
        </p>
        {lastBackup && (
          <p className="text-xs text-neutral-500 mt-1">
            Último backup: {new Date(lastBackup).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
      <Button variant="primary" onClick={onBackup} loading={isBackingUp}>
        Crear Backup
      </Button>
    </div>
  )
}
