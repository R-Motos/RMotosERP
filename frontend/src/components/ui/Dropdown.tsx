import * as React from 'react'
import { cn } from '@/utils/classNames'

/**
 * Dropdown - Menú contextual.
 * 
 * @prop trigger - Elemento trigger
 * @prop items - Array de items { key, label, icon?, onClick? }
 * @prop align - left | right
 */
interface DropdownProps {
  trigger: React.ReactNode
  items: { key: string; label: string; icon?: React.ReactNode; onClick?: () => void }[]
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 min-w-[180px] z-dropdown',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map(item => (
            <button
              key={item.key}
              onClick={() => {
                item.onClick?.()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
