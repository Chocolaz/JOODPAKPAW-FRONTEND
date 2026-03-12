'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/app/_components/AuthContext'
import { AppHeader } from '@/app/_components/AppHeader'
import { ChatSidebar } from './_components/ChatSidebar'

export default function ChatPage() {
  const { requireAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    requireAuth()
  }, [])

  return (
    <>
      {/* Mobile: full room list */}
      <div className="lg:hidden">
        <AppHeader title="Messages" />
        <div className="pb-24">
          <ChatSidebar />
        </div>
      </div>

      {/* Desktop: right-panel empty state (sidebar in layout handles the list) */}
      <div className="hidden lg:flex h-full flex-col items-center justify-center gap-4 text-neutral-gray">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-gray-500">เลือกการสนทนา</p>
          <p className="text-sm text-gray-400 mt-1">เลือกจากรายการทางซ้ายเพื่อเริ่มแชท</p>
        </div>
      </div>
    </>
  )
}
