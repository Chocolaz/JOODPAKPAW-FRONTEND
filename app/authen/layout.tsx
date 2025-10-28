'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setIsAuthenticated(true)
      router.push('/')
    } else {
        setIsAuthenticated(false)
    }
  }, [router])

  if (isAuthenticated) {
    return null // Or a loading spinner while redirecting
  }

  return <>{children}</>
}
