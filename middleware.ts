import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const adminRoutes = ['/admin', '/admin/create-category', '/admin/create-product'];
const authRoutes = ['/profile', '/checkout', '/orders'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const isAdminRoute = adminRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // If not authenticated and trying to access a protected route
  if (!token && (isAdminRoute || isAuthRoute)) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    // Send them back to where they wanted to go after login
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated but not admin on admin route
  if (token && isAdminRoute && token.role?.toLocaleLowerCase() !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
    console.log("role of admin",token?.role?.toLocaleLowerCase())
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
