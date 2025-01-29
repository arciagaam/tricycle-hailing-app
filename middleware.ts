import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth');

    if (request.nextUrl.pathname.startsWith('/_next/')) {
        return NextResponse.next();
    }

    if (!authCookie && !request.nextUrl.pathname.startsWith('/login')) return NextResponse.redirect(new URL('/login', request.url));

    if (authCookie && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api).*)'],  // Excludes /api paths
};