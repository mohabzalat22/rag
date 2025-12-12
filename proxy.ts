import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Protected routes
  const protectedRoutes = ["/chat"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL("/", req.url)); // redirect to home page
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api/(.*)"],
};
