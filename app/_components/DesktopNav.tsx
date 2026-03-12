'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useNormalizedPathname } from '@/app/_hooks/useNormalizedPathname'
import { useNotifications } from '@/app/_components/NotificationContext'
import { useChat } from '@/app/_components/ChatContext'
import { Home, Heart, Bell, User, MessageCircle } from 'lucide-react'
import { assetPath } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
]

const VISIBLE_PATHS = ['/', '/profile', '/favorites', '/notifications', '/chat']

export function DesktopNav() {
  const normalizedPath = useNormalizedPathname()
  const { unreadCount } = useNotifications()
  const { unreadCount: chatUnreadCount } = useChat()

  if (!VISIBLE_PATHS.includes(normalizedPath) && !normalizedPath.startsWith('/chat')) return null

  return (
    <nav className="hidden lg:block sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-16 lg:h-20 xl:h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative lg:w-[260px] xl:w-[320px] h-16 lg:h-20 xl:h-24 overflow-hidden">
            <Image
              src={assetPath('/icons/JOODPAK.svg')}
              alt="JoodPakPaw logo"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/chat'
              ? normalizedPath === '/chat' || normalizedPath.startsWith('/chat/')
              : normalizedPath === href
            const badgeCount =
              href === '/notifications' ? unreadCount :
              href === '/chat' ? chatUnreadCount : 0
            const showBadge = badgeCount > 0

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm lg:text-base xl:text-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-accent-orange/10 text-accent-orange'
                    : 'text-neutral-gray hover:bg-gray-50 hover:text-deep-teal'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {showBadge && (
                  <span className="absolute -top-0.5 right-1.5 min-w-4 h-4 px-0.5 bg-accent-orange rounded-full flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold leading-none">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
