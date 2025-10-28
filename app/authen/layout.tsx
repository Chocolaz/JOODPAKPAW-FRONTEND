'use client'

import { useAuthRedirect } from '@/lib/authenUtils'
import { Spinner } from '@/components/ui/spinner'

export default function AuthenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthRedirect('/')

  if (isAuthenticated === null || isAuthenticated === true) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  return <>{children}</>
}
