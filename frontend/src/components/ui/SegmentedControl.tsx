import { cn } from '@/utils/classNames'

/**
 * SegmentedControl - Selección única entre opciones limitadas.
 * 
 * @prop items - Array de opciones { key, label }
 * @prop value - Valor seleccionado
 * @prop onChange - Callback al cambiar
 */
interface SegmentedControlProps {
  items: { key: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SegmentedControl({
  items,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-neutral-100 rounded-lg',
        className
      )}
      role="radiogroup"
    >
      {items.map(item => (
        <button
          key={item.key}
          role="radio"
          aria-checked={value === item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-fast',
            value === item.key
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
