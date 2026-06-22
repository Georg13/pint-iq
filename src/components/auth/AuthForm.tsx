'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '@/store/slices/authSlice'
import { authService } from '@/lib/auth'
import { IconUser } from '@tabler/icons-react'

export default function AuthForm() {
  const t = useTranslations('auth')
  const dispatch = useAppDispatch()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = mode === 'login'
      ? await authService.signIn(email, password)
      : await authService.signUp(email, password)

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    dispatch(setUser(result.user))
  }

  return (
    <div className="rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>

      <div className="text-center mb-6">
        <div
          className="flex items-center justify-center rounded-full mx-auto mb-3"
          style={{ width: '56px', height: '56px', background: 'var(--surface)' }}
        >
          <IconUser size={26} style={{ color: 'var(--muted)' }} />
        </div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          {mode === 'login' ? t('loginTitle') : t('signupTitle')}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {mode === 'login' ? t('loginSubtitle') : t('signupSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">

        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>
            {t('email')}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>
            {t('password')}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg font-medium text-sm mt-2 transition-opacity"
          style={{
            background: 'var(--color-brand-amber)',
            color: '#FFFFFF',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? t('loading') : (mode === 'login' ? t('login') : t('signup'))}
        </button>

      </form>

      <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
        {mode === 'login' ? t('noAccount') : t('haveAccount')}{' '}
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          style={{ color: '#2563EB' }}
        >
          {mode === 'login' ? t('signupLink') : t('loginLink')}
        </button>
      </p>

    </div>
  )
}