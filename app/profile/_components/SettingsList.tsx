// components/SettingsList.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
// import Image from 'next/image' // No longer needed if using SVG as component
import { useRouter } from 'next/navigation'
import { clearTokens, isAuthenticated } from '@/lib/authenUtils'
import { useState } from 'react'

import { ChevronRight } from 'lucide-react'
import LogoutIcon from '@/public/icons/setting/logout.svg' // Import as component
import LoginIcon from '@/public/icons/setting/login.svg' // Import as component

export function SettingsList() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated())

  const handleLogout = () => {
    clearTokens()
    setIsLoggedIn(false)
  }

  const handleLogin = () => {
    router.push('/authen')
  }

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-0">
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
          onClick={isLoggedIn ? handleLogout : handleLogin}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              {isLoggedIn ? (
                <LogoutIcon className="w-6 h-6 text-neutral-gray transition-transform duration-200 ease-in-out transform hover:scale-110" />
              ) : (
                <LoginIcon className="w-6 h-6 text-neutral-gray transition-colors duration-200 ease-in-out" />
              )}
            </div>
            <span className="font-medium text-neutral-gray transition-colors duration-200 ease-in-out">
              {isLoggedIn ? 'Sign out' : 'Sign in'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-gray transition-colors duration-200 ease-in-out" />
        </button>
      </CardContent>
    </Card>
  )
}
