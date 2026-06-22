'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUser, setAuthLoading } from '@/store/slices/authSlice'
import { authService } from '@/lib/auth'

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setAuthLoading())

    // Проверяем активная ли сессия
    authService.getCurrentUser().then(user => {
      dispatch(setUser(user))
    })

    // Подписываемся на будущие изменения 
    const unsubscribe = authService.onAuthChange(user => {
      dispatch(setUser(user))
    })

    // Cleanup отписываемся когда компонент размонтируется
    return () => unsubscribe()
  }, [dispatch])

  return <>{children}</>
}