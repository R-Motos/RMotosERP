import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { AuditActionBadge } from './AuditActionBadge'
import type { AuditLog } from '../types/audit'

interface AuditDetailModalProps {
  isOpen: boolean
  onClose: () => void
  log: AuditLog | null
}

export function AuditDetailModal({ isOpen, onClose, log }: AuditDetailModalProps) {
  if (!log) return null

  const parseJson = (jsonString: string | null) => {
    if (!jsonString) return null
    try {
      return JSON.parse(jsonString)
    } catch {
      return jsonString
    }
  }

  const datosAnteriores = parseJson(log.datos_anteriores)
  const datosNuevos = parseJson(log.datos_nuevos)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Registro #${log.id}`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500">Fecha</p>
            <p className="text-sm font-medium text-neutral-900">
              {new Date(log.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Usuario ID</p>
            <p className="text-sm font-medium text-neutral-900">#{log.usuario_id}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Módulo</p>
            <p className="text-sm font-medium text-neutral-900">{log.modulo}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Acción</p>
            <AuditActionBadge accion={log.accion} />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Registro ID</p>
            <p className="text-sm font-medium text-neutral-900">#{log.registro_id}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Descripción</p>
            <p className="text-sm font-medium text-neutral-900">{log.descripcion}</p>
          </div>
        </div>

        {(datosAnteriores || datosNuevos) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {datosAnteriores && (
              <div>
                <p className="text-xs text-neutral-500 mb-2">Datos anteriores</p>
                <pre className="text-xs bg-neutral-50 p-3 rounded-lg overflow-x-auto border border-neutral-200">
                  {JSON.stringify(datosAnteriores, null, 2)}
                </pre>
              </div>
            )}
            {datosNuevos && (
              <div>
                <p className="text-xs text-neutral-500 mb-2">Datos nuevos</p>
                <pre className="text-xs bg-neutral-50 p-3 rounded-lg overflow-x-auto border border-neutral-200">
                  {JSON.stringify(datosNuevos, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {!datosAnteriores && !datosNuevos && (
          <p className="text-sm text-neutral-500 italic">Sin datos de cambio disponibles</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  )
}
