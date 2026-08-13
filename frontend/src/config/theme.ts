import { Theme, ThemeConfig } from '@/types/theme'

export const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: '#D91E27',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  },
}

export const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    primary: '#f87171',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
  },
}

export const themes: Record<Theme, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
}
