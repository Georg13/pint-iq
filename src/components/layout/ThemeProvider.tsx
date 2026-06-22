'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(state => state.theme.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    document.cookie = `pintiq-theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  }, [theme])

  return <>{children}</>
}