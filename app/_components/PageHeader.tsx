import Image from 'next/image'

export function PageHeader() {
  return (
    <header>
      <h4 className="mt-7 text-deep-teal">
        Discover Local Pet Hotels & Care Homes Near You GitHub Actions
      </h4>
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
