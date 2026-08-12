import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { UserToolbar } from '@/modules/users/components/UserToolbar'
import { UserFilters } from '@/modules/users/components/UserFilters'
import { UserTable } from '@/modules/users/components/UserTable'
import { UserForm } from '@/modules/users/components/UserForm'
import { UserView } from '@/modules/users/components/UserView'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'
import { useUsers } from '@/modules/users/hooks/useUsers'
import { useUserForm } from '@/modules/users/hooks/useUsers'
import { useUserFilters } from '@/modules/users/hooks/useUserFilters'
import { useAuth } from '@/app/providers/AuthProvider'
import type { User } from '@/modules/users/types/user'

export function UserList() {
  const { addToast } = useToast()
  const { refreshUser } = useAuth()

  const { users, isLoading, error, executeFetch } = useUsers()
  const { filters, handleFilterChange, handleClear, hasActiveFilters } = useUserFilters()
  const form = useUserForm(() => executeFetch(filters))

  const [toggleTarget, setToggleTarget] = useState<User | null>(null)

  const handleToggleState = useCallback(async () => {
    if (!toggleTarget) return
    const nuevoEstado = toggleTarget.estado === 'activo' ? 'inactivo' : 'activo'
    try {
      await form.changeState(toggleTarget.id, nuevoEstado)
      addToast({ type: 'success', message: `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}` })
      setToggleTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al cambiar estado del usuario' })
    }
  }, [toggleTarget, form.changeState, addToast, executeFetch, filters])

  const handleFormSubmit = useCallback(async (data: { nombre?: string; username?: string; email?: string; telefono?: string; rol_ids?: number[]; modules?: string[]; estado?: 'activo' | 'inactivo' }) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingUser ? 'Usuario actualizado' : 'Usuario creado' })
      await refreshUser()
    } catch {
      addToast({ type: 'error', message: 'Error al guardar el usuario' })
    }
  }, [form.submit, form.editingUser, addToast, refreshUser])

  useEffect(() => {
    executeFetch(filters)
  }, [executeFetch, filters.estado, filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleView = useCallback((user: User) => {
    form.openView(user)
  }, [form.openView])

  const handleEdit = useCallback((user: User) => {
    form.openEdit(user)
  }, [form.openEdit])

  return (
    <div className="p-4 md:p-6">
      <UserToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={users.length}
      />

      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.q && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Búsqueda</span>}
          {filters.estado && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Estado: {filters.estado}</span>}
          <button onClick={handleClear} className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
            Limpiar
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
          <button onClick={() => executeFetch(filters)} className="text-sm text-primary-600 hover:text-primary-700 mt-1">
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="Sin usuarios"
          description="No se encontraron usuarios con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primer usuario
            </button>
          }
        />
      ) : (
        <>
          <UserTable
            data={users}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onToggleState={(user) => setToggleTarget(user)}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-neutral-500">
              Mostrando {users.length} usuarios
            </p>
          </div>
        </>
      )}

      <Dialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleState}
        title={toggleTarget?.estado === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}
        description={
          toggleTarget
            ? `¿Estás seguro de que deseas ${toggleTarget.estado === 'activo' ? 'desactivar' : 'activar'} el usuario "${toggleTarget.nombre}"?`
            : ''
        }
        confirmLabel={toggleTarget?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={toggleTarget?.estado === 'activo' ? 'danger' : 'default'}
      />

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.readOnly ? 'Ver usuario' : form.editingUser ? 'Editar usuario' : 'Nuevo usuario'}
        size="lg"
      >
        {form.readOnly && form.editingUser ? (
          <UserView user={form.editingUser} onClose={form.close} />
        ) : (
          <UserForm
            user={form.editingUser}
            onSubmit={handleFormSubmit}
            onCancel={form.close}
            isLoading={form.isLoading}
            readOnly={form.readOnly}
          />
        )}
      </Modal>
    </div>
  )
}