import { ShoppingCart } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

interface EmptyCartProps {
  onClear?: () => void
}

export function EmptyCart({ onClear }: EmptyCartProps) {
  return (
    <EmptyState
      icon={<ShoppingCart size={32} />}
      title="Carrito vacío"
      description="Agrega productos del catálogo para comenzar una venta."
      action={
        onClear && (
          <Button variant="secondary" size="sm" onClick={onClear}>
            Limpiar
          </Button>
        )
      }
    />
  )
}
