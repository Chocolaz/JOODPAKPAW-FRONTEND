'use client'
import { useNormalizedPathname } from '@/app/_hooks/useNormalizedPathname'
import Link from 'next/link'
import { motion } from 'framer-motion'
import BellIcon from '@/public/icons/nav/Bell.svg'
import HeartIcon from '@/public/icons/nav/Heart.svg'
import HomeIcon from '@/public/icons/nav/Home.svg'
import ProfileIcon from '@/public/icons/nav/Profile.svg'

export function BottomNav() {
  const normalizedPath = useNormalizedPathname()

  const visiblePaths = ['/', '/profile', '/favorites']

  if (!visiblePaths.includes(normalizedPath)) {
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
          const isActive = normalizedPath === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full pt-3 pb-2"
            >
              <motion.div
                className="absolute top-0 w-10 h-[3px] rounded-full bg-accent-orange"
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <item.icon
                className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? 'text-accent-orange' : 'text-gray-500'
                }`}
              />

              <motion.div
                className="overflow-hidden"
                initial={false}
                animate={{ height: isActive ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs font-medium text-accent-orange baloo2 pt-1">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
