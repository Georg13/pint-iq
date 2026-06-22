// Универсальный пользователь
export interface AppUser {
  id: string                  // id пользователя
  email: string | null        // email (может быть null)
  displayName?: string        // имя
  avatarUrl?: string          // аватар (для OAuth Google даёт фото)
  createdAt: string           // когда зарегистрировался
}

// Результат операций авторизации
export interface AuthResult {
  user: AppUser | null
  error: string | null
}

// Контракт
export interface AuthService {
  // Регистрация по email/паролю
  signUp(email: string, password: string): Promise<AuthResult>

  // Вход по email/паролю
  signIn(email: string, password: string): Promise<AuthResult>

  // Вход через Google (на будущее!!!)
  signInWithGoogle(): Promise<AuthResult>

  // Выход
  signOut(): Promise<void>

  // Получить текущего пользователя (если активная сессия)
  getCurrentUser(): Promise<AppUser | null>

  // Возвращает функцию для отписки (cleanup)
  onAuthChange(callback: (user: AppUser | null) => void): () => void
}