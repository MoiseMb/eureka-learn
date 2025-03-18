import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request });


    const protectedRoutes = ['/dashboard', '/profile', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    const authRoutes = ['/login'];
    const isAuthRoute = authRoutes.includes(pathname);

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }


    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};