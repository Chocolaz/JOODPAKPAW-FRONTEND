import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/profile/:path*',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow main /profile page
  if (pathname === '/profile') return NextResponse.next()

  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')

  // ปล่อยให้ client handle ถ้าไม่มี token
  // ไม่ redirect server-side เพื่อให้ SPA remount
  return NextResponse.next()
}
