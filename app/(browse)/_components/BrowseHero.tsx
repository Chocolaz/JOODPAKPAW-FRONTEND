import Image from 'next/image'
import { assetPath } from '@/lib/utils'

interface BrowseHeroProps {
  /** Optional slot rendered between the text and the graphic on desktop (e.g. SearchBar) */
  searchBar?: React.ReactNode
  /** 'row' = desktop side-by-side, 'column' = mobile stacked */
  layout?: 'row' | 'column'
}

export function BrowseHero({ searchBar, layout = 'column' }: BrowseHeroProps) {
  const text = (
    <div className={layout === 'row' ? 'space-y-3' : 'space-y-1'}>
      <h4
        className={
          layout === 'row'
            ? 'text-deep-teal text-4xl xl:text-5xl leading-tight font-bold'
            : 'text-deep-teal text-2xl font-bold leading-tight'
        }
      >
        Discover Local Pet Hotels &amp; Care Homes Near You
      </h4>
      <p
        className={
          layout === 'row'
            ? 'text-neutral-gray text-lg xl:text-xl'
            : 'text-neutral-gray text-sm'
        }
      >
        Find the perfect home away from home for your furry friends.
      </p>
    </div>
  )

  const graphic = (
    <div
      className={layout === 'row' ? 'relative flex-1 shrink-0' : 'relative w-full'}
      style={{ aspectRatio: '390/144' }}
    >
      <Image
        src={assetPath('/graphics/home.svg')}
        alt="Illustration of pets and a house"
        fill
        priority
      />
    </div>
  )

  if (layout === 'row') {
    return (
      <div className="flex items-center gap-12 xl:gap-20 py-10">
        <div className="flex-1 max-w-[480px] space-y-5">
          {text}
          {searchBar}
        </div>
        {graphic}
      </div>
    )
  }

  return (
    <div className="mt-4 pb-4 flex flex-col gap-3">
      {graphic}
      {text}
    </div>
  )
}
