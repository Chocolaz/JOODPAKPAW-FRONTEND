// lib/api.ts
import request from './apiClient'
import {
  BookingRequestBody,
  CreatePropertyResponse,
  FacilitiesResponse,
  ForgotPasswordCredentials,
  HostPropertiesResponse,
  PetProfile,
  PetProfilesResponse,
  PetSizeCategoriesResponse,
  PetsResponse,
  ProfileResponse,
  Property,
  PropertyFormData,
  ResetPasswordCredentials,
  RoomCategoryFormData,
  RoomCategoriesResponse,
  SignInCredentials,
  SignInResponse,
  SignUpCredentials,
  VerifyOtpCredentials,
  Booking,
  BookingsResponse, // Added BookingsResponse
  FullBookingDetail, // Added FullBookingDetail
  HostBookingDetail,
  NotificationsResponse,
  FavoriteFoldersResponse, // Added FavoriteFoldersResponse
  PetBreedsResponse,
} from '@/types'
import { FavoriteFolderDetail } from '@/types/favorite'
import type { PropertiesResponse } from '@/types/property'

// --- Auth Functions ---
export const signIn = (
  credentials: SignInCredentials
): Promise<SignInResponse> => {
  return request<SignInResponse>({
    endpoint: 'api/v1/auth/sign-in',
    method: 'POST',
    body: credentials,
    errorContext: 'Sign-in',
  })
}

export const signUp = (credentials: SignUpCredentials) => {
  return request({
    endpoint: 'api/v1/auth/sign-up',
    method: 'POST',
    body: credentials,
    errorContext: 'Sign-up',
  })
}

export const verifyOtp = (
  credentials: VerifyOtpCredentials
): Promise<SignInResponse> => {
  return request<SignInResponse>({
    endpoint: 'api/v1/auth/verify-otp',
    method: 'POST',
    body: credentials,
    errorContext: 'OTP Verification',
  })
}

export const resendOtp = (credentials: { email: string }) => {
  return request({
    endpoint: 'api/v1/auth/resend-otp',
    method: 'POST',
    body: credentials,
    errorContext: 'Resend OTP',
  })
}

export const forgotPassword = (credentials: ForgotPasswordCredentials) => {
  return request({
    endpoint: 'api/v1/auth/forgot-password',
    method: 'POST',
    body: credentials,
    errorContext: 'Forgot Password',
  })
}

export const resetPassword = (credentials: ResetPasswordCredentials) => {
  return request({
    endpoint: 'api/v1/auth/reset-password',
    method: 'POST',
    body: credentials,
    errorContext: 'Reset Password',
  })
}

// --- User Functions ---
export const getProfile = (): Promise<ProfileResponse> => {
  return request<ProfileResponse>({
    endpoint: 'api/v1/auth/profile',
    method: 'GET',
    requiresAuth: true,
    silentAuth: true,
    errorContext: 'Get Profile',
    cache: 'no-store',
  })
}

export const updateUserProfile = (userId: string, formData: FormData) => {
  return request({
    endpoint: `api/v1/users/${userId}`,
    method: 'PUT',
    body: formData,
    requiresAuth: true,
    errorContext: 'Update Profile',
  })
}

export const getAllPetProfiles = (): Promise<PetProfilesResponse> => {
  return request<PetProfilesResponse>({
    endpoint: 'api/v1/profiles/pet-profiles/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get All Pet Profiles',
  })
}

export const getPetProfileById = (id: string): Promise<PetProfile> => {
  return request<PetProfile>({
    endpoint: `api/v1/profiles/pet-profiles/${id}`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Pet Profile By Id',
  })
}

export const createPetProfile = (formData: FormData) => {
  return request({
    endpoint: 'api/v1/profiles/pet-profiles',
    method: 'POST',
    body: formData,
    requiresAuth: true,
    errorContext: 'Create Pet Profile',
  })
}

export const updatePetProfile = (id: string, formData: FormData) => {
  return request({
    endpoint: `api/v1/profiles/pet-profiles/${id}`,
    method: 'PUT',
    body: formData,
    requiresAuth: true,
    errorContext: 'Update Pet Profile',
  })
}

export const deletePetProfile = (id: string): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/profiles/pet-profiles/${id}`,
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete Pet Profile',
  })
}

// --- Property Functions ---
export const getProperties = (
  page: number,
  limit: number,
  search?: string,
  searchBy?: string
): Promise<PropertiesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (search) {
    params.append('search', search)
  }
  if (searchBy) {
    params.append('searchBy', searchBy)
  }

  return request<PropertiesResponse>({
    endpoint: `api/v1/properties?${params.toString()}`,
    method: 'GET',
    errorContext: 'Get Properties',
    sendAuthIfAvailable: true,
  })
}

export const getPropertyById = (
  propertyId: string
): Promise<{ property: Property }> => {
  return request<{ property: Property }>({
    endpoint: `api/v1/properties/${propertyId}`,
    method: 'GET',
    errorContext: 'Get Property By Id',
  })
}

export const getHostProperties = (): Promise<HostPropertiesResponse> => {
  return request<HostPropertiesResponse>({
    endpoint: 'api/v1/hosts/properties/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Host Properties',
  })
}

export const getHostPropertyById = (
  propertyId: string
): Promise<{ property: Property }> => {
  return request<{ property: Property }>({
    endpoint: `api/v1/hosts/properties/${propertyId}`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Host Property By Id',
  })
}

export const updateHostPropertyIsActive = async (
  propertyId: string,
  isActive: boolean
): Promise<void> => {
  await request({
    endpoint: `api/v1/hosts/properties/${propertyId}/is-active`,
    method: 'PATCH',
    body: { isActive },
    requiresAuth: true,
    errorContext: 'Update Property Active Status',
  })
}

export const getFacilities = (): Promise<FacilitiesResponse> => {
  return request<FacilitiesResponse>({
    endpoint: 'api/v1/hosts/facilities/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Facilities',
  })
}

export const getPetTypes = (): Promise<PetsResponse> => {
  return request<PetsResponse>({
    endpoint: 'api/v1/pets/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Pet Types',
  })
}

export const getPetBreeds = (petTypeId: number): Promise<PetBreedsResponse> => {
  return request<PetBreedsResponse>({
    endpoint: `api/v1/pets/${petTypeId}/pet-breeds/all`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Pet Breeds',
  })
}

export const getPetSizeCategories = (): Promise<PetSizeCategoriesResponse> => {
  return request<PetSizeCategoriesResponse>({
    endpoint: 'api/v1/pet-size-categories/all',
    method: 'GET',
    sendAuthIfAvailable: true,
    errorContext: 'Get Pet Size Categories',
  })
}

export const deleteRoomCategory = (
  propertyId: number,
  roomCategoryId: number
): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/hosts/properties/${propertyId}/room-categories/${roomCategoryId}`,
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete Room Category',
  })
}

export const createProperty = (data: PropertyFormData) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'images') {
      ;(value as File[]).forEach((file: File) => {
        formData.append('images', file)
      })
    } else if (key === 'facilities') {
      formData.append('facilities', JSON.stringify(value))
    } else if (value !== null) {
      formData.append(key, String(value))
    }
  })

  return request<CreatePropertyResponse>({
    endpoint: 'api/v1/hosts/properties',
    method: 'POST',
    body: formData,
    requiresAuth: true,
    errorContext: 'Create Property',
  })
}

export const updateProperty = (propertyId: string, data: FormData) => {
  return request({
    endpoint: `api/v1/hosts/properties/${propertyId}`,
    method: 'PUT',
    body: data,
    requiresAuth: true,
    errorContext: 'Update Property',
  })
}

export const deleteProperty = (propertyId: string): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/hosts/properties/${propertyId}`,
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete Property',
  })
}

export const createRoomCategory = (
  propertyId: number,
  data: RoomCategoryFormData
) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'pets' || key === 'facilities') {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  })

  return request({
    endpoint: `api/v1/hosts/properties/${propertyId}/room-categories`,
    method: 'POST',
    body: formData,
    requiresAuth: true,
    errorContext: 'Create Room Category',
  })
}

export const getRoomCategories = (
  propertyId: number
): Promise<RoomCategoriesResponse> => {
  return request<RoomCategoriesResponse>({
    endpoint: `api/v1/hosts/properties/${propertyId}/room-categories/all`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Room Categories',
  })
}

export const searchRoomCategories = (
  propertyId: number,
  checkInDate: string,
  checkOutDate: string,
  numberOfPets: number,
  petSizeId?: number
): Promise<RoomCategoriesResponse> => {
  const params = new URLSearchParams({
    checkInDate,
    checkOutDate,
    numberOfPets: String(numberOfPets),
  })
  if (petSizeId !== undefined) {
    params.append('petSizeId', String(petSizeId))
  }
  return request<RoomCategoriesResponse>({
    endpoint: `api/v1/properties/${propertyId}/room-categories/search?${params.toString()}`,
    method: 'GET',
    errorContext: 'Search Room Categories',
  })
}

// --- Booking Functions ---
export const createBooking = (data: BookingRequestBody): Promise<Booking> => {
  return request<Booking>({
    endpoint: 'api/v1/bookings',
    method: 'POST',
    body: data,
    requiresAuth: true,
    errorContext: 'Create Booking',
  })
}

export const getBookings = (): Promise<BookingsResponse> => {
  return request<BookingsResponse>({
    endpoint: 'api/v1/bookings/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Bookings',
    cache: 'no-store',
  })
}

export const getBookingById = (
  bookingId: string
): Promise<FullBookingDetail> => {
  return request<FullBookingDetail>({
    endpoint: `api/v1/bookings/${bookingId}`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Booking By Id',
  })
}

export const confirmPayment = (bookingId: number): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/bookings/${bookingId}/confirm-payment`,
    method: 'PATCH',
    requiresAuth: true,
    errorContext: 'Confirm Payment',
  })
}

export const cancelBooking = (bookingId: string): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/bookings/${bookingId}/cancel`,
    method: 'PATCH',
    requiresAuth: true,
    errorContext: 'Cancel Booking',
  })
}

export const getHostBookings = (): Promise<BookingsResponse> => {
  return request<BookingsResponse>({
    endpoint: `api/v1/hosts/bookings/all`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Host Bookings',
    cache: 'no-store',
  })
}

export const completeBooking = (bookingId: number): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/hosts/bookings/${bookingId}/success`,
    method: 'PATCH',
    requiresAuth: true,
    errorContext: 'Complete Booking',
  })
}

export const getHostBookingById = (
  bookingId: string
): Promise<HostBookingDetail> => {
  return request<HostBookingDetail>({
    endpoint: `api/v1/hosts/bookings/${bookingId}`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Host Booking By Id',
  })
}

export const getHostPropertyBookings = (
  propertyId: string
): Promise<BookingsResponse> => {
  return request<BookingsResponse>({
    endpoint: `api/v1/hosts/properties/${propertyId}/bookings/all`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Host Property Bookings',
    cache: 'no-store',
  })
}

// --- Favorite Functions ---
export const getFavoriteFolders = (): Promise<FavoriteFoldersResponse> => {
  return request<FavoriteFoldersResponse>({
    endpoint: 'api/v1/favorite-folders/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Favorite Folders',
  })
}

export const getFavoriteFolderById = async (
  folderId: string
): Promise<FavoriteFolderDetail> => {
  // Define local types for the raw API response to avoid conflicts
  interface ApiFavoriteProperty {
    id: number
    title: string
    province: string
    firstImage: string
  }

  interface ApiFavoriteFolderDetail {
    id: number
    name: string
    propertyCount: number
    createdAt: string
    properties: ApiFavoriteProperty[]
  }

  const response = await request<ApiFavoriteFolderDetail>({
    endpoint: `api/v1/favorite-folders/${folderId}`,
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Favorite Folder By Id',
  })

  // Transform the simplified properties into full Property objects
  const transformedProperties: Property[] = response.properties.map(
    (favProperty) => ({
      id: favProperty.id,
      title: favProperty.title,
      province: favProperty.province,
      images: favProperty.firstImage
        ? [
            {
              id: 0,
              filePath: favProperty.firstImage,
              fileName: '',
              fileContentType: '',
              fileExtensionName: '',
              fileSize: 0,
            },
          ]
        : [],
      // Add default values for other required fields
      description: '',
      district: '',
      country: '',
      latitude: '0',
      longitude: '0',
      zipcode: '',
      isActive: true,
      isFavorite: true, // Favorites are always favorited
      avgRating: 0,
      hostId: 0,
      propertyTypeId: 0,
      createdAt: '',
      updatedAt: '',
    })
  )

  const firstPropertyImage =
    transformedProperties.length > 0 &&
    transformedProperties[0].images.length > 0
      ? transformedProperties[0].images[0].filePath
      : ''

  return {
    ...response,
    firstPropertyImage,
    properties: transformedProperties,
  }
}

export const addFavorite = (data: {
  propertyId: number
  folderId?: number
  folderName?: string
}): Promise<void> => {
  return request<void>({
    endpoint: 'api/v1/favorite-folders',
    method: 'POST',
    body: data,
    requiresAuth: true,
    errorContext: 'Add Favorite',
  })
}

export const createFavoriteFolder = (name: string): Promise<void> => {
  return request<void>({
    endpoint: 'api/v1/favorite-folders',
    method: 'POST',
    body: { folderName: name },
    requiresAuth: true,
    errorContext: 'Create Favorite Folder',
  })
}

export const deleteFavoriteFolder = (folderId: string): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/favorite-folders/${folderId}`,
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete Favorite Folder',
  })
}

export const renameFavoriteFolder = (
  folderId: string,
  name: string
): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/favorite-folders/${folderId}`,
    method: 'PUT',
    body: { name },
    requiresAuth: true,
    errorContext: 'Rename Favorite Folder',
  })
}

export const deleteFavoriteProperty = (propertyId: number): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/favorite-properties/${propertyId}`,
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete Favorite Property',
  })
}

// --- Review Functions ---
export const submitReview = (
  bookingId: string,
  data: { rating: number; comment: string }
): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/bookings/${bookingId}/review`,
    method: 'POST',
    body: data,
    requiresAuth: true,
    errorContext: 'Submit Review',
  })
}

// --- Notification Functions ---
export const getNotifications = (): Promise<NotificationsResponse> => {
  return request<NotificationsResponse>({
    endpoint: 'api/v1/notifications',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Notifications',
  })
}

export const deleteAllNotifications = (): Promise<void> => {
  return request<void>({
    endpoint: 'api/v1/notifications',
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete All Notifications',
  })
}

export const deleteNotificationById = (id: string): Promise<void> => {
  return request<void>({
    endpoint: `api/v1/notifications/${id}`,
    method: 'DELETE',
    requiresAuth: true,
    errorContext: 'Delete Notification',
  })
}

export const moveFavorite = async (data: {
  propertyId: number
  folderId?: number
  folderName?: string
}): Promise<void> => {
  await deleteFavoriteProperty(data.propertyId)
  await addFavorite(data)
}
