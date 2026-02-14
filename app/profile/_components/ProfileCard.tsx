'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

export const ProfileCard = ({
  profile,
  onPasswordChangeClick,
}: {
  profile: UserProfile
  onPasswordChangeClick: () => void
}) => {
  const router = useRouter()
  const guestAvatarSrc = `${router.basePath || ''}/graphics/guest.jpg`
  return (
    <Card className="my-2">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4 border border-gray-200 ring-1 ring-gray-200 ring-offset-10 ring-offset-background">
          <AvatarImage
            src={profile.avatar || guestAvatarSrc}
            alt={`${profile.firstName} ${profile.lastName}`}
          />
          <AvatarFallback className="text-3xl">
            {profile.firstName?.charAt(0)}
            {profile.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="space-y-2">
          <h3 className="mt-2">
            {profile.firstName} {profile.lastName}
          </h3>
          <div className="flex justify-center">
            <span className="text-neutral-gray font-normal">
              {profile.isBecomeToHost ? 'Host' : 'Guest'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium text-neutral-gray">Email</span>
          <span>{profile.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-neutral-gray">Phone</span>
          <span>{profile.phone}</span>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onPasswordChangeClick}
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  )
}
