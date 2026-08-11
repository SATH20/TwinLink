import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/terms(.*)",
  "/privacy(.*)",
])

// Define onboarding route
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  const pathname = req.nextUrl.pathname

  // Allow public routes
  if (isPublicRoute(req)) {
    console.log(`[middleware] PUBLIC route allowed: ${pathname}`)
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!userId) {
    console.log(`[middleware] No userId — redirecting to /login from: ${pathname}`)
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // ─── IMPORTANT ───────────────────────────────────────────────────────────
  // Clerk stores unsafeMetadata under sessionClaims.unsafeMetadata (NOT .metadata).
  // sessionClaims is the JWT payload minted at sign-in time and is only refreshed
  // when the token expires or is explicitly rotated via getToken({ skipCache: true }).
  //
  // After user.update({ unsafeMetadata }) on the client, the frontend must call
  // await getToken({ skipCache: true }) to force a token refresh BEFORE navigating,
  // otherwise the middleware will read the old (pre-update) JWT and redirect back.
  // ─────────────────────────────────────────────────────────────────────────

  // Read onboardingComplete from the correct claim key
  const unsafeMeta = sessionClaims?.unsafeMetadata as { onboardingComplete?: boolean } | undefined
  const hasCompletedOnboarding = unsafeMeta?.onboardingComplete === true

  console.log(`[middleware] pathname=${pathname}`)
  console.log(`[middleware] userId=${userId}`)
  console.log(`[middleware] sessionClaims.unsafeMetadata=`, JSON.stringify(unsafeMeta))
  console.log(`[middleware] hasCompletedOnboarding=${hasCompletedOnboarding}`)

  // If accessing onboarding and already completed, redirect to dashboard
  if (isOnboardingRoute(req) && hasCompletedOnboarding) {
    console.log(`[middleware] Already completed onboarding → redirecting to /dashboard`)
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If accessing protected route and haven't completed onboarding, redirect to onboarding
  if (!isOnboardingRoute(req) && !hasCompletedOnboarding) {
    console.log(
      `[middleware] BLOCKING: onboardingComplete=${hasCompletedOnboarding}, unsafeMeta=${JSON.stringify(unsafeMeta)} → redirecting ${pathname} → /onboarding`
    )
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  console.log(`[middleware] Allowing: ${pathname}`)
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
