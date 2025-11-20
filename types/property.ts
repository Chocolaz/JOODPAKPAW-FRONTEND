import { Pet } from './pet'

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
  basePrice: number
  numberOfPets: number
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
