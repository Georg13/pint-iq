'use client'

import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser } from '@/store/slices/authSlice'
import { authService } from '@/lib/auth'
import { IconUserCircle, IconLogout } from '@tabler/icons-react'

export default function ProfileInfo() {
  const t = useTranslations('auth')
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)

  const handleLogout = async () => {
    await authService.signOut()
    dispatch(setUser(null))
  }

  if (!user) return null

  return (
    <div className="rounded-xl p-6 text-center" style={{ border: '1px solid var(--border)' }}>
      <IconUserCircle size={56} style={{ color: 'var(--muted)' }} className="mx-auto mb-3" />

      <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{t('loggedInAs')}</p>
      <p className="text-sm font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        {user.email}
      </p>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium"
        style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        <IconLogout size={16} />
        {t('logout')}
      </button>
    </div>
  )
}