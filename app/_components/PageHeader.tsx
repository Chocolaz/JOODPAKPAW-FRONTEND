import Image from 'next/image'

interface PageHeaderProps {
  title?: string
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header>
      {title ? (
        <h1 className="mt-7 text-deep-teal text-2xl font-bold">{title}</h1>
      ) : (
        <h4 className="mt-7 text-deep-teal">
          Discover Local Pet Hotels & Care Homes Near You GitHub Actions15
        </h4>
      )}
      <div className="mt-4">
        <Image
          src="/graphics/home.svg"
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
