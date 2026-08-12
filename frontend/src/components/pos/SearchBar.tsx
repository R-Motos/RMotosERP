import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/classNames'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  inputRef?: React.Ref<HTMLInputElement>
}

export function SearchBar({ value, onChange, placeholder = 'Buscar producto...', className, inputRef }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      leftIcon={<Search size={18} className="text-neutral-400" />}
      className={cn('bg-white', className)}
      ref={inputRef}
    />
  )
}
