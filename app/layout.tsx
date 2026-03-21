'use client'

import { usePathname } from 'next/navigation'
import './globals.css'
import { afacad, baloo2, sarabun, prompt } from './fonts'

// Suppress vaul's spurious pointer-capture error (upstream bug, cosmetic only)
if (typeof window !== 'undefined') {
  const _consoleError = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('releasePointerCapture')) return
    _consoleError(...args)
  }
}
import { BottomNav } from '@/app/_components/BottomNav'
import { DesktopNav } from '@/app/_components/DesktopNav'
import { AuthWrapper } from '@/app/_components/AuthWrapper'
import { Toaster } from '@/components/ui/sonner'
import { BookingProvider } from './_context/BookingContext'
import { AuthModalProvider } from './_components/AuthModalProvider'
import { NotificationProvider } from './_components/NotificationContext'
import { ChatProvider } from './_components/ChatContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const showBottomNav = !pathname.startsWith('/authen') && !isAdmin

  return (
    <html lang="en">
      <head>
        <title>JOODPAKPAW</title>
        <meta name="description" content="Booking petsitting made easy" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${afacad.variable} ${baloo2.variable} ${sarabun.variable} ${prompt.variable} bg-white`}>
        <AuthWrapper>
          <AuthModalProvider>
            <NotificationProvider>
              <ChatProvider>
              <BookingProvider>
                <DesktopNav />
                <div className={`flex flex-col min-h-screen w-full${isAdmin ? '' : ' max-w-[1440px] mx-auto lg:pt-20 xl:pt-24'}`}>
                  <main className="flex-1">{children}</main>
                  {showBottomNav && <BottomNav />}
                </div>
                <Toaster />
              </BookingProvider>
              </ChatProvider>
            </NotificationProvider>
          </AuthModalProvider>
        </AuthWrapper>
      </body>
    </html>
  )
}
