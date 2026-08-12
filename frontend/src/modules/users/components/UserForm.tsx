import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { userService } from '@/modules/users/services/user.service'
import { getModulesForRoles } from '@/utils/permissions'
import type { User, UserCreate, UserUpdate } from '../types/user'

const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

const TODOS_LOS_MODULOS = [
  'productos',
  'categorias',
  'marcas',
  'etiquetas',
  'clientes',
  'usuarios',
  'proveedores',
  'ordenes_compra',
  'recepciones_compra',
  'ventas',
  'movimientos',
  'finanzas',
  'configuracion',
  'dashboard',
  'auditoria',
  'pos',
  'cupones',
  'devoluciones',
  'garantias',
]

const MODULO_LABELS: Record<string, string> = {
  productos: 'Productos',
  categorias: 'Categorías',
  marcas: 'Marcas',
  etiquetas: 'Etiquetas',
  clientes: 'Clientes',
  usuarios: 'Usuarios',
  proveedores: 'Proveedores',
  ordenes_compra: 'Órdenes de compra',
  recepciones_compra: 'Recepciones de compra',
  ventas: 'Ventas',
  movimientos: 'Inventario',
  finanzas: 'Finanzas',
  configuracion: 'Configuración',
  dashboard: 'Dashboard',
  auditoria: 'Auditoría',
  pos: 'POS',
  cupones: 'Cupones',
  devoluciones: 'Devoluciones',
  garantias: 'Garantías',
}

interface UserFormProps {
  user: User | null
  onSubmit: (data: UserCreate | UserUpdate) => void
  onCancel: () => void
  isLoading: boolean
  readOnly?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading, readOnly }: UserFormProps) {
  const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([])
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [formData, setFormData] = useState<UserCreate>({
    nombre: user?.nombre || '',
    username: user?.username || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    rol_ids: user?.roles.map(r => r.id) || [],
    estado: user?.estado || 'activo',
  })

  useEffect(() => {
    userService.listRoles().then(setRoles)
  }, [])

  useEffect(() => {
    if (user) {
      const modules = user.modules && user.modules.length > 0
        ? user.modules
        : (() => {
            const moduleSet = new Set<string>()
            for (const role of user.roles) {
              const mods = getModulesForRoles([role.nombre])
              for (const mod of mods) {
                moduleSet.add(mod)
              }
            }
            return Array.from(moduleSet)
          })()
      setSelectedModules(modules)
    }
  }, [user])

  const handleChange = useCallback((field: string, value: unknown) => {
    if (readOnly) return
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [readOnly])

  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, opt => Number(opt.value))
    handleChange('rol_ids', selected)
  }, [handleChange])

  const handleModuleToggle = useCallback((modulo: string) => {
    setSelectedModules(prev => {
      const next = prev.includes(modulo) ? prev.filter(m => m !== modulo) : [...prev, modulo]
      return next
    })
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    onSubmit({ ...formData, modules: selectedModules })
  }, [formData, onSubmit, readOnly, selectedModules])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        value={formData.nombre}
        onChange={e => handleChange('nombre', e.target.value)}
        required
        readOnly={readOnly}
      />
      <Input
        label="Usuario"
        value={formData.username}
        onChange={e => handleChange('username', e.target.value)}
        required
        readOnly={readOnly}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={e => handleChange('email', e.target.value || null)}
        readOnly={readOnly}
      />
      <Input
        label="Teléfono"
        value={formData.telefono || ''}
        onChange={e => handleChange('telefono', e.target.value || null)}
        readOnly={readOnly}
      />
      <Input
        label="PIN"
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={formData.pin || ''}
        onChange={e => handleChange('pin', e.target.value || null)}
        required={!user}
        readOnly={readOnly}
      />
      <Select
        label="Roles"
        options={roles.map(r => ({ value: r.id, label: r.nombre }))}
        value={(formData.rol_ids || []).map(String)}
        onChange={handleRoleChange}
        multiple
        disabled={readOnly}
      />
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Módulos</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-lg p-3">
          {TODOS_LOS_MODULOS.map(modulo => (
            <label key={modulo} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModules.includes(modulo)}
                onChange={() => handleModuleToggle(modulo)}
                disabled={readOnly}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              {MODULO_LABELS[modulo] || modulo}
            </label>
          ))}
        </div>
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