import type { Metadata } from 'next'
import './globals.css'
import { afacad, baloo2 } from './fonts'
import { BottomNav } from '@/app/_components/BottomNav'
import { AuthProvider } from '@/app/_components/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { BookingProvider } from './_context/BookingContext'

export const metadata: Metadata = {
  title: 'JOODPAKPAW',
  description: 'Booking petsitting made easy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* apply both variable classes, and base font = afacad */}
      <body className={`${afacad.variable} ${baloo2.variable} bg-white`}>
        <AuthProvider>
          <BookingProvider>
            <div className="max-w-[500px] mx-auto flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
              <BottomNav />
            </div>
            <Toaster />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
