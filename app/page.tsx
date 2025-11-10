import { PageHeader } from './_components/PageHeader'
import { PropertyList } from './_components/PropertyList'
import { SearchBar } from './_components/SearchBar'

export default function Home() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col px-5">
      <SearchBar />
      <PageHeader />
      <PropertyList />
    </div>
  )
}

