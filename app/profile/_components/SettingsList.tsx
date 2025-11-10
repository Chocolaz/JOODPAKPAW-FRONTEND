// components/SettingsList.tsx
'use client' // This is required for the onClick handler

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
// --- NEW ICON IMPORTS ---
import LanguageIcon from '@/public/icons/iconoir_language.svg'
import CurrencyIcon from '@/public/icons/ri_currency-line.svg'
import TermsIcon from '@/public/icons/Measurment.svg' // Using this from your screenshot
import LogoutIcon from '@/public/icons/setting/logout.svg'

// We still need the arrow. I'll use lucide-react for just this one.
// If you have your own arrow SVG, import it like the others.
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
