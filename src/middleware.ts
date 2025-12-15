import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

// ✅ next-intl middleware routing config
const intlMiddleware = createMiddleware({
  locales: ["en", "tr"],
  defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Run i18n middleware first
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Auth cookies
  const token =
    req.cookies.get("__session")?.value || req.cookies.get("authToken")?.value;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const isAdmin = req.cookies.get("role")?.value === "admin";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|_static|favicon.ico|manifest.json|robots.txt|sitemap.xml|images|icons|fonts|api).*)",
  ],
};
