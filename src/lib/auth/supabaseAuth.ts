import { supabase } from '@/lib/supabase/client'
import type { AuthService, AuthResult, AppUser } from './types'
import type { User } from '@supabase/supabase-js'

// Преобразуем пользователя Supabase в наш универсальный AppUser
const mapUser = (user: User | null): AppUser | null => {
  if (!user) return null

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: user.user_metadata?.display_name,
    avatarUrl: user.user_metadata?.avatar_url,
    createdAt: user.created_at,
  }
}

export const supabaseAuthService: AuthService = {

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: mapUser(data.user), error: null }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: mapUser(data.user), error: null }
  },

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { user: null, error: error.message }
    }

    // OAuth делает редирект(пользователь вернётся после авторизации в Google)
    return { user: null, error: null }
  },

  async signOut() {
    await supabase.auth.signOut()
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return mapUser(data.user)
  },

  onAuthChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(mapUser(session?.user ?? null))
      }
    )

    // Возвращаем функцию отписки(для cleanup в useEffect)
    return () => subscription.unsubscribe()
  },
}