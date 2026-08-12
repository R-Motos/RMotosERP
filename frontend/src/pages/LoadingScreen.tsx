import { Loader } from '@/components/ui/Loader'

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
      <Loader size="lg" />
      <p className="text-sm font-medium text-neutral-700">Verificando credenciales...</p>
    </div>
  )
}
