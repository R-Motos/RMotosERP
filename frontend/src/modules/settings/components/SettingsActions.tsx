import { Button } from '@/components/ui/Button'

interface SettingsActionsProps {
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
  hasChanges: boolean
}

export function SettingsActions({ onSave, onCancel, isLoading, hasChanges }: SettingsActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 pt-4">
      <Button variant="secondary" onClick={onCancel} disabled={isLoading || !hasChanges}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={onSave} loading={isLoading} disabled={!hasChanges}>
        Guardar cambios
      </Button>
    </div>
  )
}
