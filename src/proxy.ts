import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Читаем тему из cookie
  const theme = request.cookies.get('pintiq-theme')?.value ?? 'light'

  // i18n
  const response = intlMiddleware(request)

  // Добавляем тему в заголовок передаём в layout
  response.headers.set('x-theme', theme)

  return response
}

export const config = {
  // Применяем middleware(proxy) ко всем маршрутам кроме служебных
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}