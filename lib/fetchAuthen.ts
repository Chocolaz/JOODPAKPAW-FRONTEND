import {
  ForgotPasswordCredentials,
  ProfileResponse,
  ResetPasswordCredentials,
  SignInCredentials,
  SignInResponse,
  SignUpCredentials,
  VerifyOtpCredentials,
} from '@/types'
import { getAccessToken } from './tokenManager'
import { ApiError } from './errorHandling'
import { refreshAccessToken, clearTokens } from './authenUtils'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function post<T>(
  endpoint: string,
  body: unknown,
  errorContext: string
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Something went wrong',
        data.code,
        data.errors
      )
    }

    return data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      console.error(`${errorContext} failed:`, error.message, error.code)
    } else if (error instanceof Error) {
      console.error(`${errorContext} failed:`, error.message)
    } else {
      console.error(`${errorContext} failed:`, error)
    }
    throw error
  }
}

async function get<T>(endpoint: string, errorContext: string): Promise<T> {
  let token = getAccessToken()
  if (!token) {
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        // Retry the request with the new token
        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
          },
        })
        const retryData = await retryResponse.json()
        if (!retryResponse.ok) {
          throw new ApiError(
            retryData.message || 'Something went wrong on retry',
            retryData.code,
            retryData.errors
          )
        }
        return retryData
      } else {
        clearTokens()
        throw new Error('Session expired. Please log in again.')
      }
    }

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Something went wrong',
        data.code,
        data.errors
      )
    }

    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`${errorContext} failed:`, error.message)
    } else {
      console.error(`${errorContext} failed:`, error)
    }
    throw error
  }
}

async function putWithFormData<T>(
  endpoint: string,
  formData: FormData,
  errorContext: string
): Promise<T> {
  let token = getAccessToken()
  if (!token) {
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
          body: formData,
        })
        const retryData = await retryResponse.json()
        if (!retryResponse.ok) {
          throw new ApiError(
            retryData.message || 'Something went wrong on retry',
            retryData.code,
            retryData.errors
          )
        }
        return retryData
      } else {
        clearTokens()
        throw new Error('Session expired. Please log in again.')
      }
    }

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Something went wrong',
        data.code,
        data.errors
      )
    }

    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`${errorContext} failed:`, error.message)
    } else {
      console.error(`${errorContext} failed:`, error)
    }
    throw error
  }
}

// --- API Functions ---
export const signIn = (
  credentials: SignInCredentials
): Promise<SignInResponse> => {
  return post<SignInResponse>('api/v1/auth/sign-in', credentials, 'Sign-in')
}

export const signUp = (credentials: SignUpCredentials) => {
  return post('api/v1/auth/sign-up', credentials, 'Sign-up')
}

export const verifyOtp = (
  credentials: VerifyOtpCredentials
): Promise<SignInResponse> => {
  return post<SignInResponse>(
    'api/v1/auth/verify-otp',
    credentials,
    'OTP Verification'
  )
}

export const resendOtp = (credentials: { email: string }) => {
  return post('api/v1/auth/resend-otp', credentials, 'Resend OTP')
}

export const forgotPassword = (credentials: ForgotPasswordCredentials) => {
  return post('api/v1/auth/forgot-password', credentials, 'Forgot Password')
}

export const resetPassword = (credentials: ResetPasswordCredentials) => {
  return post('api/v1/auth/reset-password', credentials, 'Reset Password')
}

export const refreshToken = async (token: string): Promise<string> => {
  const response = await post<{ accessToken: string }>(
    'api/v1/auth/refresh-token',
    { refreshToken: token },
    'Refresh Token'
  )
  return response.accessToken
}

export const getProfile = (): Promise<ProfileResponse> => {
  return get<ProfileResponse>('api/v1/auth/profile', 'Get Profile')
}

export const updateUserProfile = (userId: string, formData: FormData) => {
  return putWithFormData(`api/v1/users/${userId}`, formData, 'Update Profile')
}
