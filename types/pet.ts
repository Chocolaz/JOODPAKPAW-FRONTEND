export interface Pet {
  id: number
  name: string
}

export interface PetsResponse {
  pets: Pet[]
}

export interface PetSizeCategory {
  id: number
  name: string
  code: number
  min: number
  max: number
}

export interface PetSizeCategoriesResponse {
  petSizeCategories: PetSizeCategory[]
}

export interface PetProfile {
  id: number
  name: string
  image: string | null // Changed from avatar
  birthDate: string // ISO date string
  age: number // Added based on example
  petTypeName: string
  // Removed: userId, petTypeId, petSizeId, petSizeName, breed, gender, weight, isNeutered, createdAt, updatedAt
}

export interface PetProfilesResponse {
  petProfiles: PetProfile[]
}
