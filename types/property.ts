import { Pet } from './pet'
import { Facility } from './api'

export interface PropertyImage {
  id: number
  fileName: string
  filePath: string
  fileContentType: string
  fileExtensionName: string
  fileSize: number
}

export interface RoomCategory {
  id: number
  name: string
  totalRoom: number
  numberOfPets: number
  basePrice: number
  propertyId: number
  pets: {
    id: number
    name: string
  }[]
  facilities: {
    id: number
    name: string
  }[]
}

export interface PropertyType {
  id: number
  name: string
}

export interface Property {
  id: number
  title: string
  description: string
  province: string
  district: string
  country: string
  latitude: string
  longitude: string
  zipcode: string
  isActive: boolean
  avgRating: number
  hostId: number
  propertyTypeId: number
  images: PropertyImage[]
  roomCategory: RoomCategory
  pets: Pet[]
  createdAt: string
  updatedAt: string
  reviewCount?: number
  propertyType?: PropertyType
  facilities?: Facility[]
}

export interface PropertiesResponse {
  totalRows: number
  totalPages: number
  data: Property[]
  limit: number
  page: number
  orderBy: string
  sort: string
}

export interface HostPropertiesResponse {
  properties: Property[]
}

export interface RoomCategoriesResponse {
  roomCategories: RoomCategory[]
}
