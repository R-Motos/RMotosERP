import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { SettingsSection } from '@/modules/settings/components/SettingsSection'
import { CompanySettings } from '@/modules/settings/components/CompanySettings'
import { LogoUploader } from '@/modules/settings/components/LogoUploader'
import { BackupSettings } from '@/modules/settings/components/BackupSettings'
import { RestoreSettings } from '@/modules/settings/components/RestoreSettings'
import { SettingsActions } from '@/modules/settings/components/SettingsActions'
import { useSettings } from '@/modules/settings/hooks/useSettings'
import { useBackup } from '@/modules/settings/hooks/useBackup'
import { useRestore } from '@/modules/settings/hooks/useRestore'
import type { SystemConfig } from '@/modules/settings/types/settings'

export function Settings() {
  const { addToast } = useToast()
  const { config, isLoading, error, refetch, updateConfig } = useSettings()
  const { isBackingUp, createBackup } = useBackup()
  const { isRestoring, selectedFile, setSelectedFile, restore } = useRestore()

  const [localConfig, setLocalConfig] = useState<SystemConfig | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

  useEffect(() => {
    if (localConfig && config) {
      const changed = Object.keys(localConfig).some(key => {
        if (key === 'created_at' || key === 'updated_at' || key === 'id') return false
        return localConfig[key as keyof SystemConfig] !== config[key as keyof SystemConfig]
      })
      setHasChanges(changed)
    }
  }, [localConfig, config])

  const handleConfigChange = useCallback((data: Partial<SystemConfig>) => {
    setLocalConfig(prev => prev ? { ...prev, ...data } : prev)
  }, [])

  const handleSave = useCallback(async () => {
    if (!localConfig || !config) return
    try {
      const updateData: any = {}
      Object.keys(localConfig).forEach(key => {
        if (key === 'created_at' || key === 'updated_at' || key === 'id') return
        if (localConfig[key as keyof SystemConfig] !== config[key as keyof SystemConfig]) {
          updateData[key] = localConfig[key as keyof SystemConfig]
        }
      })
      await updateConfig(updateData)
      addToast({ type: 'success', message: 'Configuración guardada' })
      setHasChanges(false)
    } catch {
      addToast({ type: 'error', message: 'Error al guardar la configuración' })
    }
  }, [localConfig, config, updateConfig, addToast])

  const handleCancel = useCallback(() => {
    if (config) {
      setLocalConfig(config)
      setHasChanges(false)
    }
  }, [config])

  const handleBackup = useCallback(async () => {
    await createBackup()
    refetch()
  }, [createBackup, refetch])

  const handleRestore = useCallback(async () => {
    await restore()
    refetch()
  }, [restore, refetch])

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={refetch} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
        </div>
      </div>
    )
  }

  if (isLoading || !localConfig) {
    return (
      <div className="p-4 md:p-6">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500 mt-1">Administra la configuración general del sistema</p>
      </div>

      <div className="space-y-6">
        <SettingsSection
          title="Empresa"
          description="Información básica del negocio"
          footer={<SettingsActions onSave={handleSave} onCancel={handleCancel} isLoading={isLoading || isBackingUp || isRestoring} hasChanges={hasChanges} />}
        >
          <CompanySettings config={localConfig} onChange={handleConfigChange} isLoading={isLoading || isBackingUp || isRestoring} />
          <div className="pt-4 border-t border-neutral-100">
            <LogoUploader config={localConfig} onUpdate={handleConfigChange} isLoading={isLoading || isBackingUp || isRestoring} />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Backup"
          description="Copia de seguridad de la base de datos"
        >
          <BackupSettings onBackup={handleBackup} isBackingUp={isBackingUp} />
        </SettingsSection>

        <SettingsSection
          title="Restaurar"
          description="Restaura la base de datos desde un backup"
        >
          <RestoreSettings 
            onRestore={handleRestore} 
            isRestoring={isRestoring} 
            selectedFile={selectedFile}
            onFileChange={setSelectedFile}
          />
        </SettingsSection>
      </div>
    </div>
  )
}
