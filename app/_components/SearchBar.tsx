import { Input } from '@/components/ui/input'
import { Search, TextSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  value: string
}

export function SearchBar({ onSearch, value }: SearchBarProps) {
  const [internalSearchValue, setInternalSearchValue] = useState(value)

  useEffect(() => {
    setInternalSearchValue(value)
  }, [value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(internalSearchValue)
  }

  return (
    <div className="sticky top-4 z-50 w-full bg-white/95 rounded-full backdrop-blur">
      <div className="container flex h-14 items-center">
        <form onSubmit={handleSubmit} className="relative flex w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-10 pr-10 rounded-full"
            value={internalSearchValue}
            onChange={(e) => {
              setInternalSearchValue(e.target.value)
              onSearch(e.target.value)
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-accent-orange"
          >
            <TextSearch className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
