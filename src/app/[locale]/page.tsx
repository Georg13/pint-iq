import { useTranslations } from 'next-intl'
import SearchBar from '@/components/ui/SearchBar'

export default function Home() {
  const t = useTranslations('home')

  return (
    <main
      className="flex flex-col justify-center h-full px-6"
      style={{ color: 'var(--foreground)' }}
    >
      <div className="mb-6">
        <p className="text-2xl font-bold text-center mb-15" style={{ color: 'var(--muted)' }}>
          {t('subtitle')}
        </p>
      </div>
      <SearchBar />
    </main>
  )
}