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
