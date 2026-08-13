import { useEffect } from 'react'
import { cn } from '@/utils/classNames'

interface PinPadProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

interface KeyDef {
  label: string
  value: string
  action?: 'backspace' | 'clear'
}

const KEYS: readonly KeyDef[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: 'Borrar', value: 'backspace', action: 'backspace' },
  { label: '0', value: '0' },
  { label: 'Limpiar', value: 'clear', action: 'clear' },
]

export function PinPad({ value, onChange, maxLength = 4 }: PinPadProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditable = document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement

      if (isEditable) return

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        if (value.length < maxLength) {
          onChange(value + e.key)
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        onChange(value.slice(0, -1))
      } else if (e.key === 'Delete' || e.key === 'Escape') {
        e.preventDefault()
        onChange('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [value, onChange, maxLength])

  const handlePress = (key: KeyDef) => {
    if (key.action === 'backspace') {
      onChange(value.slice(0, -1))
    } else if (key.action === 'clear') {
      onChange('')
    } else if (value.length < maxLength) {
      onChange(value + key.value)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-6">
      {KEYS.map((key) => (
        <button
          key={key.label}
          type="button"
          onClick={() => handlePress(key)}
          className={cn(
            'h-14 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-sm active:scale-95',
            key.action
              ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              : 'bg-white text-neutral-900 border border-neutral-200 hover:border-primary-300 hover:text-primary-600 shadow-md'
          )}
        >
          {key.label}
        </button>
      ))}
    </div>
  )
}
