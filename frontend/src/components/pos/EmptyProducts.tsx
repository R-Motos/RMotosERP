import { PackageOpen } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

interface EmptyProductsProps {
  onClearSearch?: () => void
}

export function EmptyProducts({ onClearSearch }: EmptyProductsProps) {
  return (
    <EmptyState
      icon={<PackageOpen size={32} />}
      title="Sin resultados"
      description="No encontramos productos con ese término de búsqueda."
      action={
        onClearSearch && (
          <Button variant="secondary" size="sm" onClick={onClearSearch}>
            Limpiar búsqueda
          </Button>
        )
      }
    />
  )
}
