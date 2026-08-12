import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { PinPad } from '@/components/ui/PinPad'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useAuth } from '@/app/providers/AuthProvider'

export function LoginScreen() {
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const navigate = useNavigate()
  const isMobile = useMediaQuery() === 'mobile'
  const { login, error, isAuthenticated, user } = useAuth()
  const lastAttemptRef = useRef<{ u: string; p: string } | null>(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    if (!username.trim() || pin.length !== 4) {
      return
    }

    const current = `${username.trim()}|${pin}`
    const last = lastAttemptRef.current
    if (last && `${last.u}|${last.p}` === current) {
      return
    }

    const timer = setTimeout(() => {
      lastAttemptRef.current = { u: username.trim(), p: pin }
      submittingRef.current = true
      login(username, pin).finally(() => {
        submittingRef.current = false
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [pin, username, login, navigate])

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.roles.some(r => r.nombre === 'administrador') ? '/dashboard' : '/pos', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">RMotos</h1>
          <p className="text-sm text-neutral-500">Sistema de Gestión</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Usuario"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Ingrese su usuario"
            autoComplete="username"
          />
          <Input
            label="PIN"
            type={isMobile ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingrese su PIN"
            error={error ?? undefined}
            autoFocus={!username}
            readOnly={isMobile}
          />

          {isMobile && (
            <PinPad value={pin} onChange={setPin} />
          )}
        </div>
      </div>
    </div>
  )
}
