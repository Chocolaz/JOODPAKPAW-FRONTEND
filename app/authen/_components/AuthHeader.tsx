import Image from 'next/image'

type AuthHeaderProps = {
  children: React.ReactNode
}

export default function AuthHeader({ children }: AuthHeaderProps) {
  return (
    <div className="relative w-full flex justify-center pt-10">
      <div className="absolute top-0 z-0">
        <Image
          src="/graphics/Ellipse.svg"
          alt="Background Ellipse"
          width={452}
          height={308}
        />
      </div>
      <div className="z-10">{children}</div>
    </div>
  )
}
