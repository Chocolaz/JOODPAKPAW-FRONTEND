'use client'

import { useAuth } from '@/app/_components/AuthContext'

export function HostBanner() {
  const { user } = useAuth()

  return (
    <div className="bg-off-white py-10 px-10 rounded-bl-xl rounded-br-xl -mt-2 shadow-sm w-full">
      <p className="text-lg text-accent-orange">
        Hello {user?.firstName} {user?.lastName}
      </p>
      <h4 className="text-deep-teal">Manage your host activities below!</h4>
    </div>
  )
}
