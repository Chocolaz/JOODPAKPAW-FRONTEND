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
  image: string | null
  birthDate: string
  age?: number // In list view
  petTypeName?: string // In list view
  sex?: 'male' | 'female' // In detail view
  petBreedName?: string // In detail view
  rating?: number // In detail view
  contactName?: string // In detail view
  contactPhone?: string // In detail view
  note?: string // In detail view
}

export interface PetProfilesResponse {
  petProfiles: PetProfile[]
}

export interface PetProfileFormData {
  petTypeId: number | null
}
