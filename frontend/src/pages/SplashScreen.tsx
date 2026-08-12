import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '@/components/ui/Loader'
import { useAuth } from '@/app/providers/AuthProvider'

export function SplashScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, user, isLoading } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        navigate(user.roles.some(r => r.nombre === 'administrador') ? '/dashboard' : '/pos', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-2xl">R</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-900">RMotos</h1>
        <Loader size="md" />
        <p className="text-sm text-neutral-500">Verificando credenciales...</p>
      </div>
    )
  }

  return null
}
