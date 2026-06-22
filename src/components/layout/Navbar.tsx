'use client'

import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  IconSearch,
  IconNotebook,
  IconBuilding,
  IconUser,
} from '@tabler/icons-react'

interface NavItem {
  key: string
  path: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
}

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  const isActive = (path: string) => {
    const cleanPath = pathname.replace(`/${locale}`, '') || '/'
    return cleanPath === path
  }

  const navigate = (path: string) => {
    router.push(`/${locale}${path === '/' ? '' : path}`)
  }

  const NAV_ITEMS = [
    { key: 'search',  path: '/',        icon: <IconSearch size={22} /> },
    { key: 'diary',   path: '/diary',   icon: <IconNotebook size={22} /> },
    { key: 'bars',    path: '/bars',    icon: <IconBuilding size={22} /> },
    { key: 'profile', path: '/profile', icon: <IconUser size={22} /> },
  ]

  return (
    <nav
      className="flex border-t w-full"
      style={{
        background: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => navigate(item.path)}
          className="flex-1 flex flex-col items-center justify-center py-3 transition-opacity"
          style={{
            color: isActive(item.path)
              ? 'var(--color-brand-amber)'
              : 'var(--muted)',
          }}
        >
          {item.icon}
          <span className="text-xs mt-1 font-medium">
            {t(item.key)}
          </span>
        </button>
      ))}
    </nav>
  )
}