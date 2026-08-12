import * as React from 'react'
import { Input } from '@/components/ui/Input'

/**
 * SearchInput - Campo de búsqueda con icono.
 * 
 * @prop onSearch - Callback al cambiar el valor
 */
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  onSearch?: (value: string) => void
}

export function SearchInput({ className, onSearch, ...props }: SearchInputProps) {
  return (
    <Input
      type="search"
      className={className}
      onChange={(e) => onSearch?.(e.target.value)}
      {...props}
    />
  )
}
