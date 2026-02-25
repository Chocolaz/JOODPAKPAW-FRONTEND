'use client'

import { Property } from '@/types'
import { PropertyCard } from './PropertyCard'
import { motion } from 'framer-motion'

interface PropertyListProps {
  properties: Property[]
  className?: string
  buildHref?: (property: Property) => string
  showRoomCount?: boolean
  showStatusIcon?: boolean
  showPetPolicyChip?: boolean
  showHeartIcon?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export function PropertyList({
  properties,
  className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 px-5',
  buildHref,
  showRoomCount,
  showStatusIcon,
  showPetPolicyChip,
  showHeartIcon,
}: PropertyListProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {properties.map((property) => (
        <motion.div key={property.id} variants={itemVariants}>
          <PropertyCard
            property={property}
            href={buildHref ? buildHref(property) : undefined}
            showRoomCount={showRoomCount}
            showStatusIcon={showStatusIcon}
            showPetPolicyChip={showPetPolicyChip}
            showHeartIcon={showHeartIcon}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
