import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SettingsList } from './_components/SettingsList'
import PawPrint from '@/public/icons/PawPrint.svg'
import History from '@/public/icons/History.svg'
import HostIcon from '@/public/icons/Host.svg'

export default function ProfilePage() {
  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-[500px] flex flex-col overflow-hidden">
        <div className="flex-1 flex-col gap-[15px] p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>

          {/* New wrapper div for cards */}
          <div className="flex flex-col gap-[15px]">
            {/* Profile Card */}
            <Card className="w-full overflow-hidden">
              <CardContent className="p-0 flex flex-col items-center justify-center pt-8 pb-6 relative bg-linear-to-r from-orange-100 to-green-100">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src="/graphics/Ellipse.png" alt="Jane Doe" />{' '}
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
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                  <PawPrint />
                  <span className="font-medium text-gray-800">Pets</span>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                  <History />
                  <span className="font-medium text-gray-800">History</span>
                </CardContent>
              </Card>
            </div>

            {/* "Become a host" Card */}
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                <HostIcon />
                <span className="font-medium text-gray-800">Become a host</span>
              </CardContent>
            </Card>
          </div> {/* End of new wrapper div */}

          <SettingsList />
        </div>
      </div>
    </main>
  )
}
