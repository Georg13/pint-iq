'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const nextLocale = locale === 'ru' ? 'en' : 'ru'
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center justify-center rounded-xl transition-colors text-xs font-medium"
      style={{
        width: '40px',
        height: '40px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
      }}
    >
      {locale === 'ru' ? 'EN' : 'RU'}
    </button>
  )
}