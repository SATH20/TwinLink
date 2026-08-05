import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
])

// Define onboarding route
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!userId) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check if user has completed onboarding
  const metadata = sessionClaims?.metadata as { onboardingComplete?: boolean } | undefined
  const hasCompletedOnboarding = metadata?.onboardingComplete ?? false

  // If accessing onboarding and already completed, redirect to dashboard
  if (isOnboardingRoute(req) && hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If accessing protected route and haven't completed onboarding, redirect to onboarding
  if (!isOnboardingRoute(req) && !hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
