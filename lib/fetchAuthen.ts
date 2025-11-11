import {
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  SignInCredentials,
  SignInResponse,
  SignUpCredentials,
  VerifyOtpCredentials,
} from '@/types'
import { getAccessToken } from './authenUtils'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function post<T>(
  endpoint: string,
  body: any,
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
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error: any) {
    console.error(`${errorContext} failed:`, error.message)
    throw error
  }
}

async function get<T>(endpoint: string, errorContext: string): Promise<T> {
  const token = getAccessToken()
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

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error: any) {
    console.error(`${errorContext} failed:`, error.message)
    throw error
  }
}

// --- Type Definitions ---
interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar: string
  phone: string
  isBecomeToHost: boolean
}

interface ProfileResponse {
  code: number
  data: UserProfile
  message: string
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
