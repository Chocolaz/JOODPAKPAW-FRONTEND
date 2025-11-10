// components/SettingsList.tsx
"use client" // This is required for the onClick handler

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
// --- NEW ICON IMPORTS ---
import LanguageIcon from "@/public/icons/iconoir_language.svg"
import CurrencyIcon from "@/public/icons/ri_currency-line.svg"
import TermsIcon from "@/public/icons/Measurment.svg" // Using this from your screenshot
import LogoutIcon from "@/public/icons/Logout.svg"

// We still need the arrow. I'll use lucide-react for just this one.
// If you have your own arrow SVG, import it like the others.
import { ChevronRight } from "lucide-react"

export function SettingsList() {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-0">

        {/* Item 1: Language */}
        <a
          href="#"
          className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            {/* --- YOUR ICON --- */}
            <Image
                    src={LanguageIcon}
                    alt="Pets"
                    width={40}
                    height={40}
                    className="w-7 h-7"
                  />
            <span className="font-medium text-gray-800">Language</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">English</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </a>

        {/* Item 2: Currency */}
        <a
          href="#"
          className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            {/* --- YOUR ICON --- */}
            <Image
                    src={CurrencyIcon}
                    alt="Pets"
                    width={40}
                    height={40}
                    className="w-7 h-7"
                  />
            <span className="font-medium text-gray-800">Currency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">THB</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </a>

        {/* Item 3: Terms & Condition */}
        <a
          href="#"
          className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            {/* --- YOUR ICON --- */}
            <Image
                    src={TermsIcon}
                    alt="Pets"
                    width={40}
                    height={40}
                    className="w-5 h-5"
                  />
            <span className="font-medium text-gray-800">Terms & Condition</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </a>

        {/* Item 4: Logout */}
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
          onClick={() => alert("Logout clicked!")}
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