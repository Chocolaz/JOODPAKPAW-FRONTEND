// app/profile/page.tsx
// (This page can stay a Server Component)

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SettingsList } from './_components/SettingsList' // We'll make this

// --- NEW ICON IMPORTS ---
// Import your SVGs directly as components
import PawPrint from '@/public/icons/PawPrint.svg'
import History from '@/public/icons/History.svg'
// I'll use Home.svg as seen in your screenshot. If you renamed it
// to Host.svg, just change the import path.
import HostIcon from '@/public/icons/Host.svg'

export default function ProfilePage() {
  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-[500px] flex flex-col overflow-hidden">
        {/* Scrollable Content Area */}
        <div className="flex-1 flex-col gap-4 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold text-center">Profile</h2>

          {/* Profile Card */}
          <Card className="w-full overflow-hidden">
            {/* ... (Avatar, Jane Doe, etc. - no changes here) ... */}
            <CardContent className="p-0 flex flex-col items-center justify-center pt-8 pb-6 relative bg-linear-to-r from-orange-100 to-green-100">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src="/graphics/Ellipse.png" alt="Jane Doe" />{' '}
                {/* Assuming Ellipse.png is your profile pic */}
                <AvatarFallback className="text-3xl">JD</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                Jane Doe
              </h3>
              <p className="text-sm text-gray-600">Guest</p>
            </CardContent>
          </Card>

          {/* Action Grid ("Pets" & "History") */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pets Card */}
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                {/* --- THIS IS YOUR ICON! --- */}
                <PawPrint />
                <span className="font-medium text-gray-800">Pets</span>
              </CardContent>
            </Card>

            {/* History Card */}
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                {/* --- THIS IS YOUR ICON! --- */}
                <History />
                <span className="font-medium text-gray-800">History</span>
              </CardContent>
            </Card>
          </div>

          {/* "Become a host" Card */}
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              {/* --- THIS IS YOUR ICON! --- */}
              <HostIcon />
              <span className="font-medium text-gray-800">Become a host</span>
            </CardContent>
          </Card>

          {/* Settings List (as a separate component) */}
          <SettingsList />
        </div>
      </div>
    </main>
  )
}
