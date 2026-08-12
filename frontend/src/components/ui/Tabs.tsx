import { cn } from '@/utils/classNames'

/**
 * Tabs - Navegación por pestañas.
 * 
 * @prop items - Array de pestañas { key, label }
 * @prop activeKey - Pestaña activa
 * @prop onTabChange - Callback al cambiar
 */
interface TabsProps {
  items: { key: string; label: string }[]
  activeKey: string
  onTabChange: (key: string) => void
  className?: string
}

export function Tabs({ items, activeKey, onTabChange, className }: TabsProps) {
  return (
    <div className={cn('border-b border-neutral-200', className)}>
      <nav className="flex gap-1" role="tablist">
        {items.map(item => (
          <button
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            onClick={() => onTabChange(item.key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeKey === item.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
