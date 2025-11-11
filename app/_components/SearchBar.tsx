import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function SearchBar() {
  return (
    <div className="sticky top-4 z-50 w-full bg-white/95 rounded-full backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search" className="pl-10 py-7 rounded-full" />
        </div>
      </div>
    </div>
  )
}
