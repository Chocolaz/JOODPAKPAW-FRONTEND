import { Property } from '@/types'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div>
      <div className="relative w-[130px] h-[130px]">
        <Image
          src={
            property.images.length > 0
              ? `${API_BASE_URL}${property.images[0].filePath}`
              : '/graphics/home.svg'
          }
          alt={property.title}
          width={130}
          height={130}
          className="object-cover rounded-[14px] shadow-lg"
        />
      </div>
      <div className="mt-2 w-[130px]">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-deep-teal">
          {property.title}
        </p>
        <p className="text-[10px] text-gray-500">
          {property.province}, {property.district}
        </p>
        {property.roomCategory && (
          <p className="font-bold text-[10px]">
            THB {property.roomCategory.basePrice}
          </p>
        )}
      </div>
    </div>
  )
}
