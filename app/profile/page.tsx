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

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, login, loading: authLoading } = useAuth()

  const handleProfileClick = async () => {
    if (authLoading) return // Prevent clicks while auth is loading

    if (isAuthenticated && user) {
      router.push(`/profile/${user.firstName.toLowerCase()}`)
    } else {
      // If not authenticated, try to refresh token via AuthContext's initialization
      // The AuthProvider already handles refreshing on load.
      // If still not authenticated after AuthProvider loads, redirect to login.
      router.push('/authen')
    }
  }

  const ProfileCardContent = (
    <Card className="w-full overflow-hidden">
      <CardContent
        className={clsx(
          'p-0 flex flex-col items-center justify-center pt-8 pb-6 relative',
          {
            'bg-linear-to-r from-orange-100 to-green-100': isAuthenticated,
            'bg-linear-to-r from-gray-100 to-gray-300': !isAuthenticated,
          }
        )}
      >
        <Avatar className="w-14 h-14 border-4 border-none">
          <AvatarImage
            src="/graphics/welcome.svg"
            alt={user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          />
          <AvatarFallback className="text-3xl">
            {user
              ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
              : '?'}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-[22px] font-semibold">
          {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        </h3>
        <p className="text-sm text-neutral-gray">
          {user ? user.roles[0]?.name : 'Welcome to JoodPakPaw!'}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 flex-col gap-[15px] px-5 overflow-y-auto">
      {/* New wrapper div for cards */}
      <div className="flex flex-col gap-[15px] mb-4">
        {/* Profile Card */}
        <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          {ProfileCardContent}
        </div>

        {/* Action Grid ("Pets" & "History") */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <PawPrint />
              <span className="font-medium text-deep-teal text-[22px]">
                Pets
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <History />
              <span className="font-medium text-deep-teal text-[22px]">
                History
              </span>
            </CardContent>
          </Card>
        </div>

        {/* "Become a host" Card */}
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
            <HostIcon />
            <span className="font-medium text-deep-teal text-[22px]">
              Become a host
            </span>
          </CardContent>
        </Card>
      </div>{' '}
      {/* End of new wrapper div */}
      <SettingsList />
    </div>
  )
}
