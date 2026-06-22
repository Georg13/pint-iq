import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'

// Читаем тему из cookie ДО инициализации Redux
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const match = document.cookie.match(/pintiq-theme=(light|dark)/)
  return (match?.[1] as Theme) ?? 'light'
}

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer