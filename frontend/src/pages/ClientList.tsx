import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import { Modal } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { ClientToolbar } from '@/modules/clients/components/ClientToolbar'
import { ClientFilters } from '@/modules/clients/components/ClientFilters'
import { ClientTable } from '@/modules/clients/components/ClientTable'
import { ClientForm } from '@/modules/clients/components/ClientForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { UserPlus } from 'lucide-react'
import { useClients } from '@/modules/clients/hooks/useClients'
import { useClientFilters } from '@/modules/clients/hooks/useClientFilters'
import { useClientForm } from '@/modules/clients/hooks/useClientForm'
import { clientService } from '@/modules/clients/services/client.service'
import type { Cliente, ClienteCreate, ClienteFilter, ClienteUpdate } from '@/modules/clients/types/client'

export function ClientList() {
  const { addToast } = useToast()

  const { clients, isLoading, error, executeFetch } = useClients()
  const { filters, setFilters, handleClear, hasActiveFilters } = useClientFilters()
  const handleFormSuccess = useCallback(() => executeFetch(filters), [executeFetch, filters])
  const form = useClientForm(handleFormSuccess)

  const [stateTarget, setStateTarget] = useState<Cliente | null>(null)

  const handleToggleState = useCallback(async () => {
    if (!stateTarget) return
    const nuevoEstado = stateTarget.estado === 'activo' ? 'inactivo' : 'activo'
    try {
      await clientService.changeState(stateTarget.id, nuevoEstado)
      addToast({ type: 'success', message: `Cliente ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}` })
      setStateTarget(null)
      executeFetch(filters)
    } catch {
      addToast({ type: 'error', message: 'Error al cambiar estado del cliente' })
    }
  }, [stateTarget, filters, executeFetch, addToast])

  const handleToggleStateClick = useCallback((client: Cliente) => {
    setStateTarget(client)
  }, [])

  useEffect(() => {
    executeFetch(filters)
  }, [filters.estado, filters.q])

  const handleRefresh = useCallback(() => {
    executeFetch(filters)
  }, [executeFetch, filters])

  const handleFiltersChange = useCallback((newFilters: Partial<ClienteFilter>) => {
    setFilters({ ...filters, ...newFilters })
  }, [filters, setFilters])

  const handleFormSubmit = useCallback(async (data: ClienteCreate | ClienteUpdate) => {
    try {
      await form.submit(data)
      addToast({ type: 'success', message: form.editingClient ? 'Cliente actualizado' : 'Cliente creado' })
    } catch {
      addToast({ type: 'error', message: 'Error al guardar el cliente' })
    }
  }, [form.submit, form.editingClient, addToast])

  return (
    <div className="p-4 md:p-6">
      <ClientToolbar
        onRefresh={handleRefresh}
        onCreate={form.openCreate}
        isLoading={isLoading}
        total={clients.length}
      />

      <ClientFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {hasActiveFilters && (
        <div className="flex gap-2 mb-4">
          {filters.estado && filters.estado !== 'activo' && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Estado: {filters.estado}</span>
          )}
          {filters.q && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Búsqueda: {filters.q}</span>
          )}
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
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<UserPlus size={32} />}
          title="Sin clientes"
          description="No se encontraron clientes con los filtros aplicados"
          action={
            <button onClick={form.openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Crear primer cliente
            </button>
          }
        />
      ) : (
        <ClientTable
          data={clients}
          isLoading={isLoading}
          onEdit={form.openEdit}
          onToggleState={handleToggleStateClick}
        />
      )}

      <Dialog
        isOpen={!!stateTarget}
        onClose={() => setStateTarget(null)}
        onConfirm={handleToggleState}
        title={stateTarget?.estado === 'activo' ? 'Desactivar cliente' : 'Activar cliente'}
        description={
          stateTarget
            ? `¿Estás seguro de que deseas ${stateTarget.estado === 'activo' ? 'desactivar' : 'activar'} a ${stateTarget.nombre}?`
            : ''
        }
        confirmLabel={stateTarget?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={stateTarget?.estado === 'activo' ? 'danger' : 'default'}
      />

      <Modal
        isOpen={form.isOpen}
        onClose={form.close}
        title={form.editingClient ? 'Editar cliente' : 'Nuevo cliente'}
        size="lg"
      >
        <ClientForm
          client={form.editingClient}
          onSubmit={handleFormSubmit}
          onCancel={form.close}
          isLoading={form.isLoading}
        />
      </Modal>
    </div>
  )
}
