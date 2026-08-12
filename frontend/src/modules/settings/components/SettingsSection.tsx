import { Card } from '@/components/ui/Card'

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function SettingsSection({ title, description, children, footer }: SettingsSectionProps) {
  return (
    <Card
      header={
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
        </div>
      }
      footer={footer}
    >
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  )
}
