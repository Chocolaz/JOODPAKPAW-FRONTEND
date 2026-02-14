import { ApiError } from './errorHandling'
import { getAccessToken, refreshAccessToken, clearTokens } from './authenUtils'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

interface RequestOptions extends Omit<RequestInit, 'body'> {
  endpoint: string
  errorContext?: string
  requiresAuth?: boolean
  sendAuthIfAvailable?: boolean
  body?: unknown
}

async function request<T>({
  endpoint,
  method = 'GET',
  body,
  headers: customHeaders,
  errorContext = 'API request',
  requiresAuth = false,
  sendAuthIfAvailable = false,
  ...rest
}: RequestOptions): Promise<T> {
  const headers = new Headers(customHeaders)

  if (requiresAuth) {
    let token = getAccessToken()
    if (!token) {
      token = await refreshAccessToken()
      if (!token) {
        clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = `${BASE_PATH}/authen`
        }
      }
    }
    headers.set('Authorization', `Bearer ${token}`)
  } else if (sendAuthIfAvailable) {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  if (body && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const config: RequestInit = {
    method,
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...rest,
  }

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (response.status === 401 && requiresAuth) {
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        headers.set('Authorization', `Bearer ${newAccessToken}`)
        config.headers = headers
        response = await fetch(`${BASE_URL}${endpoint}`, config)
      } else {
        clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = `${BASE_PATH}/authen`
        }
        throw new Error('Session expired. Please login again.')
      }
    } else if (response.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = `${BASE_PATH}/forbidden`
      }
      throw new Error('Access forbidden.')
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

export default request
