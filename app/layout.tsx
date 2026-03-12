'use client'

import { usePathname } from 'next/navigation'
import './globals.css'
import { afacad, baloo2 } from './fonts'
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
  const showBottomNav = !pathname.startsWith('/authen')

  return (
    <html lang="en">
      <head>
        <title>JOODPAKPAW</title>
        <meta name="description" content="Booking petsitting made easy" />
      </head>
      <body className={`${afacad.variable} ${baloo2.variable} bg-white`}>
        <AuthWrapper>
          <AuthModalProvider>
            <NotificationProvider>
              <ChatProvider>
              <BookingProvider>
                <DesktopNav />
                <div className="max-w-[1440px] mx-auto flex flex-col min-h-screen lg:min-h-[calc(100vh-5rem)] xl:min-h-[calc(100vh-6rem)] w-full">
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
