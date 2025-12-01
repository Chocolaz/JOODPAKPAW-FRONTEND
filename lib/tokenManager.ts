import Cookies from 'js-cookie'

// --- Token Management ---
// Note: When setting cookies, the path defaults to the current path.
// Setting path: '/' makes the cookie available across the entire site.

const ACCESS_TOKEN_EXPIRY_MINUTES = parseInt(
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY_MINUTES || '30',
  10
)
const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY_DAYS || '7',
  10
)

export const saveTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('accessToken', accessToken, {
    secure: false,
    sameSite: 'lax',
    path: '/',
  })

  Cookies.set('refreshToken', refreshToken, {
    expires: REFRESH_TOKEN_EXPIRY_DAYS,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export const clearTokens = () => {
  Cookies.remove('accessToken', { path: '/' })
  Cookies.remove('refreshToken', { path: '/' })
}

export const getAccessToken = (): string | null => {
  return Cookies.get('accessToken') || null
}

export const getRefreshToken = (): string | null => {
  return Cookies.get('refreshToken') || null
}

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null
}
