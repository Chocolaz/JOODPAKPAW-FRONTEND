// components/SettingsList.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import LogoutIcon from '@/public/icons/setting/logout.svg'

import { ChevronRight } from 'lucide-react'

export function SettingsList() {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-0">
        {/* Item 4: Logout */}
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
          onClick={() => alert('Logout clicked!')}
        >
          <div className="flex items-center gap-3">
            {/* --- YOUR ICON --- */}
            <Image
              src={LogoutIcon}
              alt="Pets"
              width={5}
              height={5}
              className="w-5 h-5"
            />
            <span className="font-medium text-red-500">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </CardContent>
    </Card>
  )
}
