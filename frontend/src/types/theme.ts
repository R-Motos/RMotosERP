export type Theme = 'light' | 'dark'

export interface ThemeConfig {
  mode: Theme
  colors: {
    primary: string
    success: string
    warning: string
    error: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
}
