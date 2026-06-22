'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleTheme } from '@/store/slices/themeSlice'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.theme.theme)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="flex items-center justify-center rounded-xl transition-colors"
      style={{
        width: '40px',
        height: '40px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
        flexShrink: 0,
      }}
    >
      {!mounted ? (
        <IconMoon size={18} />
      ) : theme === 'light' ? (
        <IconMoon size={18} />
      ) : (
        <IconSun size={18} />
      )}
    </button>
  )
}