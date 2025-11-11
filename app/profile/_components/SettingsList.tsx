// components/SettingsList.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { clearTokens } from '@/lib/authenUtils'

import { ChevronRight } from 'lucide-react'

export function SettingsList() {
  const router = useRouter()

  const handleLogout = () => {
    clearTokens()
    router.push('/authen')
  }

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-0">
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <Image
                src="/icons/setting/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
            </div>
            <span className="font-medium text-neutral-gray">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-gray" />
        </button>
      </CardContent>
    </Card>
  )
}
