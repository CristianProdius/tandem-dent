import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "tandemdent_admin_session";
const PATIENT_SESSION_COOKIE = "tandemdent_session";

// Routes that require admin authentication
const adminRoutes = ["/dashboard"];

// Routes that require patient authentication
const patientRoutes = ["/portal/dashboard"];

// Public routes that don't require authentication
const publicRoutes = ["/auth", "/portal", "/portal/verify"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing admin routes
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if accessing patient routes
  const isPatientRoute = patientRoutes.some((route) => pathname.startsWith(route));

  // Get session cookies
  const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE);
  const patientSession = request.cookies.get(PATIENT_SESSION_COOKIE);

  // Admin route protection - redirect to login if no session cookie exists
  if (isAdminRoute && !adminSession?.value) {
    const loginUrl = new URL("/auth/v2/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Patient route protection
  if (isPatientRoute && !patientSession?.value) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  // Redirect authenticated admin from login to dashboard
  if (pathname.startsWith("/auth/v2/login") && adminSession?.value) {
    return NextResponse.redirect(new URL("/dashboard/clinic", request.url));
  }

  // Redirect authenticated patient from portal login to dashboard
  if (pathname === "/portal" && patientSession?.value) {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
