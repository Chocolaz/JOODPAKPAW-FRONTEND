"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PawPrint, History, Home,Globe,Landmark, Scale, LogOut, ChevronRight } from "lucide-react"
// import  {BottomNav}  from "./_components/BottomNav"
export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 p-4">
      <div className="w-full max-w-[430px] flex-grow rounded-3xl bg-gray-50 p-4 shadow-2xl">
        <div className="flex flex-col gap-4">
          
          {/* Page Title */}
          <h2 className="text-xl font-semibold text-center">Profile</h2>

          {/* Profile Card */}
          <Card className="w-full overflow-hidden">
            <CardContent className="p-0 flex flex-col items-center justify-center pt-8 pb-6 relative bg-gradient-to-r from-orange-100 to-green-100">
              
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                {/* This is where you'd put the cat image URL.
                  The "JD" fallback is showing because 'src' is missing, which is correct!
                */}
                <AvatarImage src="/path-to-your-cat-image.png" alt="Jane Doe" />
                <AvatarFallback className="text-3xl">JD</AvatarFallback>
              </Avatar>
              
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">Jane Doe</h3>
              <p className="text-sm text-gray-600">Guest</p>
            </CardContent>
          </Card>

          {/* --- NEW SECTIONS --- */}

          {/* Action Grid ("Pets" & "History") */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pets Card */}
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                <PawPrint className="w-10 h-10 text-orange-500" />
                <span className="font-medium text-gray-800">Pets</span>
              </CardContent>
            </Card>

            {/* History Card */}
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                <History className="w-10 h-10 text-orange-500" />
                <span className="font-medium text-gray-800">History</span>
              </CardContent>
            </Card>
          </div>

          {/* "Become a host" Card */}
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
              <Home className="w-10 h-10 text-red-500" />
              <span className="font-medium text-gray-800">Become a host</span>
            </CardContent>
          </Card>

          <Card className="w-full shadow-sm">
            <CardContent className="p-0">
              <a
                href="#" // In a real app, this would be <Link href="/profile/language">
                className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">English</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </a>

              {/* Item 2: Currency */}
              <a
                href="#" // In a real app, <Link href="/profile/currency">
                className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Currency</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">THB</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </a>

              {/* Item 3: Terms & Condition */}
              <a
                href="#" // In a real app, <Link href="/terms">
                className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Terms & Condition</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>

              {/* Item 4: Logout */}
              <button
                // This is a button, not a link, as it performs an action
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
                onClick={() => alert("Logout clicked!")}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-500">Logout</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
            </CardContent>
          </Card>

          {/* <BottomNav />           */}
        </div>
      </div>
    </main>
  )
}