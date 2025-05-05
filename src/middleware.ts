import { NextResponse, type NextRequest } from "next/server";

const locales = ["en-us", "fr-fr"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
    if (pathnameHasLocale) return;

    // Handle root path "/" differently to avoid double slashes
    const newPathname = pathname === "/" ? "/en-us" : `/en-us${pathname}`;
    request.nextUrl.pathname = newPathname;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ["/((?!api|_next|images/|icons/|assets/|.*\\..*).*)"]
};
