import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const adminRoutes = ['/admin', '/dashboard/admin']
const authRoutes = ['/profile', '/checkout', '/orders']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // If not authenticated and trying to access a protected page
  if (!token && (authRoutes.includes(request.nextUrl.pathname) || adminRoutes.includes(request.nextUrl.pathname))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Decode the token to check admin role (example using JWT)
  if (token && adminRoutes.includes(request.nextUrl.pathname)) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) // JWT decode
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin/category/:path*',
    '/profile',
    '/checkout',
    '/orders',
  ],
}