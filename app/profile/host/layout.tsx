'use client'

import { usePathname } from 'next/navigation'
import { HostBanner } from '@/app/profile/_components/HostBanner'

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showBanner = pathname !== '/profile/host/add-property'

  return (
    <>
      {showBanner && <HostBanner />}
      {children}
    </>
  )
}
