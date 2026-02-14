import Image from 'next/image'
import { useRouter } from 'next/router'

interface PageHeaderProps {
  title?: string
  isHost?: boolean
}

export function PageHeader({ title, isHost }: PageHeaderProps) {
  const router = useRouter()
  const imageSrc = `${router.basePath || ''}/graphics/home.svg`

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
