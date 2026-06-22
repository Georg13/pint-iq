import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { beerApi } from '@/features/beer/beerApi'
import themeReducer from '@/store/slices/themeSlice'
import authReducer from '@/store/slices/authSlice'

const rootReducer = combineReducers({
  [beerApi.reducerPath]: beerApi.reducer,
  theme: themeReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(beerApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch