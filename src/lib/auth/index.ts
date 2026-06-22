import { supabaseAuthService } from './supabaseAuth'
import type { AuthService } from './types'

export const authService: AuthService = supabaseAuthService

export type { AppUser, AuthResult } from './types'