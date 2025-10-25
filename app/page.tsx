import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col mx-5">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur mt-4">
        <div className="container flex h-14 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 py-7 rounded-full"
            />
          </div>
        </div>
      </header>
    </div>
  )
}
