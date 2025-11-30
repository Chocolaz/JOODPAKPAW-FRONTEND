import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The matcher configures which paths the middleware will run on.
export const config = {
  matcher: '/profile/:path*',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to the main /profile page for all users.
  // The client-side component will handle what to display.
  if (pathname === '/profile') {
    return NextResponse.next()
  }

  // For all deeper routes under /profile/, enforce authentication.
  const token = request.cookies.get('accessToken')

  // If there's no token, redirect to the authentication page.
  if (!token) {
    const authenUrl = new URL('/authen', request.url)
    return NextResponse.redirect(authenUrl)
  }

  // If the token exists, allow the request to proceed.
  return NextResponse.next()
}
