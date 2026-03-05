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
    /* Mobile: sticky floating pill. Desktop: static, left-aligned */
    <div className="sticky top-4 z-40 lg:static lg:top-auto lg:z-auto w-full lg:py-2">
      <div className="lg:max-w-lg">
        <div className="bg-white/95 lg:bg-white rounded-full backdrop-blur shadow-sm lg:shadow-md lg:border lg:border-gray-100">
          <form onSubmit={handleSubmit} className="relative flex w-full h-12 md:h-14 items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search properties…"
              className="pl-11 pr-14 h-full rounded-full border-0 bg-transparent focus-visible:ring-0 text-sm md:text-base"
              value={internalSearchValue}
              onChange={(e) => {
                setInternalSearchValue(e.target.value)
                onSearch(e.target.value)
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1.5 h-9 w-9 md:h-10 md:w-10 rounded-full bg-accent-orange shrink-0"
            >
              <TextSearch className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
