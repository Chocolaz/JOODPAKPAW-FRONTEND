import Image from 'next/image'
// Removed import getConfig from 'next/config'

interface PageHeaderProps {
  title?: string
  isHost?: boolean
}

export function PageHeader({ title, isHost }: PageHeaderProps) {
  // Removed const { publicRuntimeConfig } = getConfig()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const imageSrc = `${basePath}/graphics/home.svg`

  return (
    <header>
      {title ? (
        <h1 className="mt-7 text-deep-teal text-2xl font-bold">{title}</h1>
      ) : (
        <div className="flex items-center gap-2">
          <h4 className="mt-7 text-deep-teal">
            Discover Local Pet Hotels & Care Homes Near You
          </h4>
          {isHost && (
            <span className="mt-7 rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
              Host
            </span>
          )}
        </div>
      )}
      <div className="mt-4">
        <Image
          src={imageSrc}
          alt="Illustration of pets and a house"
          width={390}
          height={144}
          sizes="100vw"
          priority
        />
      </div>
    </header>
  )
}
