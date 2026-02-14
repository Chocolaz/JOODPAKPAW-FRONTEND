import Image from 'next/image'
import { assetPath } from '@/lib/utils'

type AuthHeaderProps = {
  children: React.ReactNode
}

export default function AuthHeader({ children }: AuthHeaderProps) {
  return (
    <div className="relative w-full flex justify-center  pt-10">
      <div className="absolute top-0 z-0 pointer-events-none">
        <Image
          src={assetPath('/graphics/Ellipse.svg')}
          alt="Background Ellipse"
          width={452}
          height={308}
        />
      </div>
      <div className="z-10">{children}</div>
    </div>
  )
}
