import { Property } from './property'

export interface HostProfile {
  id: number
  firstName: string
  lastName: string
  avatar: string | null
  createdAt: string
  avgRating: number
  reviewCount: number
  totalProperties: number
  properties: Property[]
}

export interface HostProfileResponse {
  host: HostProfile
}

export interface HostReview {
  id: number
  rating: number
  comment: string
  propertyName: string
  reviewedAt: string
}

export interface HostReviewsResponse {
  totalRows: number
  totalPages: number
  data: HostReview[]
}
