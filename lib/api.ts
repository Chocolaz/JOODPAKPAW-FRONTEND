// lib/api.ts
import request from './apiClient'
import {
  CreatePropertyResponse,
  FacilitiesResponse,
  ForgotPasswordCredentials,
  HostPropertiesResponse,
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
} from '@/types'

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

// --- Property Functions ---
export const getProperties = (page: number, limit: number) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  return request({
    endpoint: `api/v1/properties?${params.toString()}`,
    method: 'GET',
    errorContext: 'Get Properties',
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

export const createRoomCategory = (
  propertyId: number,
  data: RoomCategoryFormData,
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
