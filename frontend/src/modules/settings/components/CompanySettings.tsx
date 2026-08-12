import { Input } from '@/components/ui/Input'
import type { SystemConfig } from '../types/settings'

interface CompanySettingsProps {
  config: SystemConfig
  onChange: (data: Partial<SystemConfig>) => void
  isLoading?: boolean
}

export function CompanySettings({ config, onChange, isLoading }: CompanySettingsProps) {
  const handleChange = (field: keyof SystemConfig, value: string) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre del negocio"
          value={config.nombre_negocio}
          onChange={e => handleChange('nombre_negocio', e.target.value)}
          disabled={isLoading}
          placeholder="Nombre de la empresa"
        />
        <Input
          label="NIT"
          value={config.nit}
          onChange={e => handleChange('nit', e.target.value)}
          disabled={isLoading}
          placeholder="123456789"
        />
        <Input
          label="Teléfono"
          value={config.telefono}
          onChange={e => handleChange('telefono', e.target.value)}
          disabled={isLoading}
          placeholder="+57 300 123 4567"
        />
        <Input
          label="Email"
          type="email"
          value={config.email}
          onChange={e => handleChange('email', e.target.value)}
          disabled={isLoading}
          placeholder="contacto@empresa.com"
        />
        <Input
          label="Dirección"
          value={config.direccion}
          onChange={e => handleChange('direccion', e.target.value)}
          disabled={isLoading}
          placeholder="Calle 123 #45-67"
        />
        <Input
          label="Ciudad"
          value={config.ciudad}
          onChange={e => handleChange('ciudad', e.target.value)}
          disabled={isLoading}
          placeholder="Bogotá"
        />
        <Input
          label="Moneda"
          value={config.moneda}
          onChange={e => handleChange('moneda', e.target.value)}
          disabled={isLoading}
          placeholder="COP"
        />
        <Input
          label="Símbolo de moneda"
          value={config.simbolo_moneda}
          onChange={e => handleChange('simbolo_moneda', e.target.value)}
          disabled={isLoading}
          placeholder="$"
        />
      </div>
    </div>
  )
}
