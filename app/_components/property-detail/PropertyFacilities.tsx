'use client'

import { CheckCircle } from 'lucide-react'
import { Property } from '@/types'

interface PropertyFacilitiesProps {
  facilities: Property['facilities']
  description: Property['description']
}

export function PropertyFacilities({
  facilities,
  description,
}: PropertyFacilitiesProps) {
  if (!facilities || facilities.length === 0) {
    return null
  }

  return (
    <div className="border-t pt-8 mb-10">
      <h3 className="text-xl font-semibold text-deep-teal mb-2">
        What this place offers
      </h3>
      <ul className="flex flex-col gap-3">
        {facilities.map((f) => (
          <li
            key={f.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <CheckCircle className="w-5 h-5 text-accent-orange shrink-0" />
            <span className="text-neutral-dark">{f.name}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed">
        {description || 'No description provided.'}
      </p>
    </div>
  )
}
