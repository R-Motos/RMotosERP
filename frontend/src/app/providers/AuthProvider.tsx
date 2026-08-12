import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { User } from '@/types/auth'
import { authService, authStorage } from '@/services/auth.service'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, pin: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAdmin: boolean
  isSeller: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await authService.validateSession()
        if (storedUser) {
          setUser(storedUser)
        }
      } catch {
        authStorage.clear()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (username: string, pin: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const loggedUser = await authService.login(username, pin)
      setUser(loggedUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const refreshedUser = await authService.validateSession()
      if (refreshedUser) {
        setUser(refreshedUser)
      } else {
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isAdmin = user?.roles.some(r => r.nombre === 'administrador') ?? false
  const isSeller = user?.roles.some(r => r.nombre === 'vendedor') ?? false

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, logout, refreshUser, isAdmin, isSeller }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
