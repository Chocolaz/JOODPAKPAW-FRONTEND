import { Property } from '@/types'
import { PropertyCard } from '@/app/_components/PropertyCard'
import { useAuth } from '@/app/_components/AuthContext'

export function HostPropertiesSection({ properties }: { properties: Property[] }) {
  const { isAuthenticated } = useAuth()

  return (
    <section className="px-5 lg:px-12 mt-2 border-t pt-8 lg:pt-10">
      <h2 className="text-lg lg:text-xl font-semibold text-deep-teal mb-5">
        Properties ({properties.length})
      </h2>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-neutral-gray">
          <p className="text-sm">No properties listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              showPetPolicyChip
              showHeartIcon={isAuthenticated}
            />
          ))}
        </div>
      )}
    </section>
  )
}
