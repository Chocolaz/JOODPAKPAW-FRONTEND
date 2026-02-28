import Image from 'next/image'
import { assetPath } from '@/lib/utils'

interface PageHeaderProps {
  title?: string
  isHost?: boolean
}

export function PageHeader({ title, isHost }: PageHeaderProps) {
  const imageSrc = assetPath('/graphics/home.svg')

  return (
    <header className="md:flex md:items-center md:gap-8 md:py-4 lg:py-6">
      {/* Text side */}
      <div className="md:flex-1">
        {title ? (
          <h1 className="mt-7 md:mt-0 text-deep-teal text-2xl md:text-4xl lg:text-5xl font-bold">
            {title}
          </h1>
        ) : (
          <div className="flex items-center gap-2 md:block md:space-y-3">
            <h4 className="mt-7 md:mt-0 text-deep-teal md:text-2xl lg:text-3xl md:leading-snug">
              Discover Local Pet Hotels & Care Homes Near You
            </h4>
            {isHost && (
              <span className="mt-7 md:mt-0 rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
                Host
              </span>
            )}
            <p className="hidden md:block text-neutral-gray md:text-base lg:text-lg mt-2">
              Find the perfect home away from home for your furry friends.
            </p>
          </div>
        )}
      </div>

      {/* Image side */}
      <div
        className="relative mt-4 md:mt-0 w-full md:w-1/2 lg:w-2/5 shrink-0"
        style={{ aspectRatio: '390/144' }}
      >
        <Image
          src={imageSrc}
          alt="Illustration of pets and a house"
          fill
          priority
        />
      </div>
    </header>
  )
}
