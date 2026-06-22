import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PintIQ — умный справочник по пиву',
  description: 'Узнай всё о пиве и элях — вкус, аромат, сочетания с едой',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Читаем тему из заголовка который установил middleware(proxy)
  const headersList = await headers()
  const theme = headersList.get('x-theme') ?? 'light'

  return (
    <html
      suppressHydrationWarning
      className={theme === 'dark' ? 'dark' : ''}
    >
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          style={{ height: '100dvh', overflow: 'hidden' }}
        >
        {children}
      </body>
    </html>
  )
}