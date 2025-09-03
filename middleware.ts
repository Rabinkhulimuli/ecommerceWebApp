import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const adminRoutes = ['/admin', '/admin/create-category', '/admin/create-product'];
const authRoutes = ['/profile', '/checkout', '/orders'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get the session token (automatically decrypts)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

 

  const isAdminRoute = adminRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  // If not authenticated and accessing protected route
  if (!token && (isAdminRoute || isAuthRoute)) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // If accessing admin route and user is not admin
  if (token && isAdminRoute && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile',
    '/checkout',
    '/orders',
  ],
};
