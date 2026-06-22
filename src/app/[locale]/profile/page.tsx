'use client'

import { useAppSelector } from '@/store/hooks'
import AuthForm from '@/components/auth/AuthForm'
import ProfileInfo from '@/components/auth/ProfileInfo'

export default function ProfilePage() {
  const status = useAppSelector(state => state.auth.status)

  return (
    <div className="px-5 py-6">
      {(status === 'idle' || status === 'loading') && (
        <div className="flex items-center justify-center h-40">
          <p style={{ color: 'var(--muted)' }}>···</p>
        </div>
      )}

      {status === 'authenticated' && <ProfileInfo />}
      {status === 'unauthenticated' && <AuthForm />}
    </div>
  )
}