import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const privatePrefixes = ["/admin", "/dashboard", "/learn"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = privatePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const sessionCookie = getSessionCookie(request);

  // If attempting to access a private student or admin route without a session cookie, redirect to /sign-in
  if (!sessionCookie && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/learn/:path*",
  ],
};
