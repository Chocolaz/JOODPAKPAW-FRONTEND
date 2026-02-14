'use client' // Convert to client component to use hooks

import type { Metadata } from 'next'
import { usePathname } from 'next/navigation' // Import usePathname
import './globals.css'
import { afacad, baloo2 } from './fonts'
import { BottomNav } from '@/app/_components/BottomNav'
import { AuthWrapper } from '@/app/_components/AuthWrapper'
import { Toaster } from '@/components/ui/sonner'
import { BookingProvider } from './_context/BookingContext'

// Metadata can still be exported from a client component layout
// export const metadata: Metadata = {
//   title: 'JOODPAKPAW',
//   description: 'Booking petsitting made easy',
// }

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
          <BookingProvider>
            <div className="max-w-[500px] mx-auto flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
              {showBottomNav && <BottomNav />}
            </div>
            <Toaster />
          </BookingProvider>
        </AuthWrapper>
      </body>
    </html>
  )
}
