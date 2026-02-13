'use client'

import { useAuthRedirect } from '@/lib/authenUtils'
import { Spinner } from '@/components/ui/spinner'

export default function AuthenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthRedirect('/')

  // While checking auth or if user is authenticated, show a spinner before redirect happens.
  if (isAuthenticated === null || isAuthenticated === true) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  // If user is not authenticated, show the auth forms within a centering layout.
  // This will be rendered inside the RootLayout's <main> tag.
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {children}
    </div>
  )
}
