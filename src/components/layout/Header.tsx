import ThemeToggle from '@/components/ui/ThemeToggle'
import { IconBeerFilled } from '@tabler/icons-react'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const t = await getTranslations('home')

  return (
    <div
      className="flex items-center justify-between px-5 py-4 flex-shrink-0"
      style={{
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2">
        <IconBeerFilled size={26} style={{ color: 'var(--color-brand-amber)' }} />
        <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
          {t('title')}
        </span>
      </div>
      <ThemeToggle />
    </div>
  )
}