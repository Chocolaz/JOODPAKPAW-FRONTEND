'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SettingsList } from './_components/SettingsList'
import PawPrint from '@/public/icons/PawPrint.svg'
import History from '@/public/icons/History.svg'
import HostIcon from '@/public/icons/Host.svg'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/_components/AuthContext'
import clsx from 'clsx'
import { assetPath } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, requireAuth } = useAuth()
  const router = useRouter()
  const guestAvatarSrc = assetPath('/graphics/guest.jpg')

  if (authLoading) {
    return null
  }

  const checkAuthAndRedirect = (authenticatedPath: string) => {
    if (authLoading) return
    if (!requireAuth()) return
    router.push(authenticatedPath)
  }

  const handleProfileClick = () => {
    if (authLoading) return
    if (!requireAuth()) return
    if (user) {
      router.push(`/profile/${user.firstName.toLowerCase()}`)
    }
  }

  const featureItems = [
    {
      label: 'Pets',
      description: 'Manage your pet profiles',
      icon: PawPrint,
      path: '/profile/pets',
      color: 'bg-orange-50 text-accent-orange',
      iconColor: 'text-accent-orange',
    },
    {
      label: 'Bookings',
      description: 'View booking history',
      icon: History,
      path: '/profile/bookings',
      color: 'bg-teal-50 text-deep-teal',
      iconColor: 'text-deep-teal',
    },
    {
      label: 'Become a Host',
      description: 'List your property',
      icon: HostIcon,
      path: '/profile/host',
      color: 'bg-green-50 text-green-700',
      iconColor: 'text-green-600',
    },
  ]

  // --- Profile card (shared between layouts) ---
  const ProfileCard = (
    <Card
      className="w-full overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleProfileClick}
    >
      <CardContent
        className={clsx(
          'p-0 flex flex-col items-center justify-center pt-8 pb-6 relative',
          {
            'bg-linear-to-r from-orange-100 to-green-100': isAuthenticated,
            'bg-linear-to-r from-gray-100 to-gray-300': !isAuthenticated,
          }
        )}
      >
        <Avatar className="w-16 h-16 md:w-20 md:h-20 ring-4 ring-white shadow-sm">
          <AvatarImage
            src={isAuthenticated && user?.avatar ? user.avatar : guestAvatarSrc}
            alt={
              isAuthenticated && user
                ? `${user.firstName} ${user.lastName}`
                : 'Guest'
            }
          />
          <AvatarFallback className="text-3xl">
            {user
              ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
              : '?'}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-[22px] font-semibold">
          {isAuthenticated && user
            ? `${user.firstName} ${user.lastName}`
            : 'Guest'}
        </h3>
        <p className="text-sm text-neutral-gray">
          {isAuthenticated && user
            ? user.role?.some((roleItem) => roleItem.name === 'host')
              ? 'Host'
              : user.role?.[0]?.name || ''
            : 'Welcome to JoodPakPaw!'}
        </p>
      </CardContent>
    </Card>
  )

  // --- Feature card component ---
  const FeatureCard = ({
    item,
    compact = false,
  }: {
    item: (typeof featureItems)[0]
    compact?: boolean
  }) => (
    <Card
      className="shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200 group"
      onClick={() => checkAuthAndRedirect(item.path)}
    >
      <CardContent
        className={clsx(
          'flex items-center gap-4',
          compact ? 'p-4' : 'p-5 md:p-6'
        )}
      >
        <div
          className={clsx(
            'shrink-0 rounded-xl flex items-center justify-center',
            item.color,
            compact ? 'w-10 h-10' : 'w-12 h-12'
          )}
        >
          <item.icon className={clsx(compact ? 'w-5 h-5' : 'w-6 h-6', item.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-deep-teal text-base">{item.label}</p>
          <p className="text-xs text-neutral-gray mt-0.5">{item.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* ========== MOBILE LAYOUT ========== */}
      <div className="md:hidden flex-1 flex-col gap-4 px-5 overflow-y-auto mt-4">
        <div className="flex flex-col gap-4 mb-4">
          {ProfileCard}

          {/* Feature grid — 2 cols for Pets & Bookings, full width for Host */}
          <div className="grid grid-cols-2 gap-3">
            {featureItems.slice(0, 2).map((item) => (
              <Card
                key={item.label}
                className="shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200"
                onClick={() => checkAuthAndRedirect(item.path)}
              >
                <CardContent className="flex flex-col items-center justify-center p-5 gap-2">
                  <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center', item.color)}>
                    <item.icon className={clsx('w-5 h-5', item.iconColor)} />
                  </div>
                  <span className="font-medium text-deep-teal text-lg">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card
            className="shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200 group"
            onClick={() => checkAuthAndRedirect('/profile/host')}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', featureItems[2].color)}>
                <HostIcon className={clsx('w-5 h-5', featureItems[2].iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-deep-teal">Become a Host</p>
                <p className="text-xs text-neutral-gray mt-0.5">List your property</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </CardContent>
          </Card>
        </div>
        <SettingsList />
      </div>

      {/* ========== DESKTOP / TABLET LAYOUT ========== */}
      <div className="hidden md:block px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Left column — Profile card + Settings */}
          <div className="col-span-4">
            <div className="sticky top-32 space-y-4">
              {ProfileCard}
              <SettingsList />
            </div>
          </div>

          {/* Right column — Features */}
          <div className="col-span-8">
            <h3 className="text-lg font-semibold text-deep-teal mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {featureItems.map((item) => (
                <FeatureCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
