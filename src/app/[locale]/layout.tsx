import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import Providers from '@/components/layout/Providers'
import ThemeProvider from '@/components/layout/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Header from '@/components/layout/Header'
import AuthListener from '@/components/layout/AuthListener'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'ru' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
        <Providers>
          <ThemeProvider>
            <AuthListener>
              <div className="h-screen flex justify-center overflow-hidden" style={{ background: 'var(--background)' }}>
                <div className="relative w-full flex flex-col" style={{ maxWidth: '430px', height: '100dvh', background: 'var(--background)', boxShadow: '0 0 40px rgba(0,0,0,0.1)' }}>
                  <Header />
                  <div className="flex-1 overflow-hidden">
                    {children}
                  </div>
                  <Navbar />
                </div>
              </div>
            </AuthListener>
          </ThemeProvider>
        </Providers>
    </NextIntlClientProvider>
  )
}