import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/profile/:path*',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to the main /profile page for all users.
  if (pathname === '/profile') {
    return NextResponse.next()
  }

  // Check tokens in cookies
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')

  // If neither access nor refresh token exists → redirect to /authen
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/authen', request.url))
  }

  // Optional: If only accessToken is missing but refreshToken exists,
  // let the client handle refresh. So middleware still allows access.
  // Otherwise, deny access if you want stricter check.
  return NextResponse.next()
}
