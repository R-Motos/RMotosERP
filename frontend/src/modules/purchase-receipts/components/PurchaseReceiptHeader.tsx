import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PurchaseReceiptHeaderProps {
  orderNumero: string
  onBack: () => void
}

export function PurchaseReceiptHeader({ orderNumero, onBack }: PurchaseReceiptHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Recibir Compra</h1>
          <p className="text-sm text-neutral-500 mt-1">Orden {orderNumero}</p>
        </div>
      </div>
    </div>
  )
}
