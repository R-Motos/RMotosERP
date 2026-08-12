import { Badge } from '@/components/ui/Badge'
import type { User } from '../types/user'

interface UserViewProps {
  user: User
  onClose?: () => void
}

export function UserView({ user, onClose }: UserViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-primary-600">
            {user.nombre.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900">{user.nombre}</h3>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant={user.estado === 'activo' ? 'success' : 'error'}>
              {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Usuario</p>
          <p className="text-sm font-semibold text-neutral-900">{user.username}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Email</p>
          <p className="text-sm font-semibold text-neutral-900">{user.email || '—'}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Teléfono</p>
          <p className="text-sm font-semibold text-neutral-900">{user.telefono || '—'}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Roles</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map(r => (
              <Badge key={r.id} variant="default">{r.nombre}</Badge>
            ))}
          </div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Estado</p>
          <p className="text-sm font-semibold text-neutral-900">
            {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}