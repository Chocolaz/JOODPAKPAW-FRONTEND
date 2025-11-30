import Cookies from 'js-cookie'

// --- Token Management ---
// Note: When setting cookies, the path defaults to the current path.
// Setting path: '/' makes the cookie available across the entire site.

export const saveTokens = (accessToken: string, refreshToken: string) => {
  // Access token, typically short-lived
  Cookies.set('accessToken', accessToken, {
    expires: 1 / 96, // 15 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  // Refresh token, typically long-lived
  Cookies.set('refreshToken', refreshToken, {
    expires: 7, // 7 days
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
