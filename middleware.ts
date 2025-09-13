import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const adminRoutes = ['/admin', '/admin/create-category', '/admin/create-product'];
const authRoutes = ['/profile', '/checkout', '/orders'];
const superAdminRoute=['/super','/super/manage-user']
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAdminRoute = adminRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isSuperAdmin=superAdminRoute.includes(pathname)
  // If not authenticated and trying to access a protected route
  if (!token && (isAdminRoute || isAuthRoute)) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    // Send them back to where they wanted to go after login
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (token && isSuperAdmin && token.role?.toLocaleLowerCase() !== 'superadmin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // If authenticated but not admin on admin route
  if (token && isAdminRoute && token.role?.toLocaleLowerCase() !== 'admin') {
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
