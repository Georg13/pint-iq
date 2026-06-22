import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppUser } from '@/lib/auth'

interface AuthState {
  user: AppUser | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload
      state.status = action.payload ? 'authenticated' : 'unauthenticated'
    },
    setAuthLoading: (state) => {
      state.status = 'loading'
    },
  },
})

export const { setUser, setAuthLoading } = authSlice.actions
export default authSlice.reducer