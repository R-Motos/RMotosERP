import { useState, useEffect, useCallback } from 'react'
import { themes } from '@/config/theme'
import type { Theme } from '@/types/theme'

const STORAGE_KEY = 'rmotos-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (stored as Theme) || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    const config = themes[theme]
    
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    root.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  return { theme, setTheme, toggleTheme }
}
