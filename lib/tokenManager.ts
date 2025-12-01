import Cookies from 'js-cookie'

// --- Token Management ---
// Note: When setting cookies, the path defaults to the current path.
// Setting path: '/' makes the cookie available across the entire site.

export const saveTokens = (accessToken: string, refreshToken: string) => {
  Cookies.remove('accessToken', { path: '/' })
  Cookies.remove('refreshToken', { path: '/' })

  Cookies.set('accessToken', accessToken, {
    // secure: process.env.NODE_ENV === 'production', กลับมาแก้ตอนเป็น https
    secure: false,
    sameSite: 'lax',
    path: '/',
  })

  Cookies.set('refreshToken', refreshToken, {
    // secure: process.env.NODE_ENV === 'production', กลับมาแก้ตอนเป็น https
    secure: false,
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
