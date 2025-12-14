import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = ["/sign-in", "/verify-request"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = pathname.startsWith("/admin");
  const isPublicAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (sessionCookie && isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sign-in", "/verify-request"],
};
