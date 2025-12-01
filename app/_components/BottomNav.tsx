'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import BellIcon from '@/public/icons/nav/Bell.svg'
import HeartIcon from '@/public/icons/nav/Heart.svg'
import HomeIcon from '@/public/icons/nav/Home.svg'
import ProfileIcon from '@/public/icons/nav/Profile.svg'

export function BottomNav() {
  const pathname = usePathname()

  const visiblePaths = ['/', '/profile']

  if (!visiblePaths.includes(pathname)) {
    return null
  }

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/favorites', label: 'Favorites', icon: HeartIcon },
    { href: '/notifications', label: 'Notifications', icon: BellIcon },
    { href: '/profile', label: 'Profile', icon: ProfileIcon },
  ]

  return (
    <nav className="fixed bottom-4 left-0 right-0 mx-auto bg-white border border-black/20 shadow-lg rounded-[10px] max-w-[500px] w-[90%]">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full pt-3 pb-2"
            >
              <div
                className={`absolute top-0 w-10 h-[3px] rounded-full ${
                  isActive ? 'bg-accent-orange' : 'bg-transparent'
                }`}
              ></div>

              <item.icon
                className={`w-6 h-6 ${
                  isActive ? 'text-accent-orange' : 'text-gray-500'
                }`}
              />

              {isActive && (
                <span className="text-xs font-medium text-accent-orange baloo2">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
