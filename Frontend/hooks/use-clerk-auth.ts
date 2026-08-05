"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { useCallback } from "react"

/**
 * Custom hook for Clerk authentication utilities
 * Provides sign out and user management functions
 */
export function useClerkAuth() {
  const { signOut } = useClerk()
  const { user, isLoaded } = useUser()

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      // Clerk automatically redirects to sign in URL
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }, [signOut])

  const isOnboarded = useCallback(() => {
    if (!user || !isLoaded) return false
    const metadata = user.unsafeMetadata as { onboardingComplete?: boolean } | undefined
    return metadata?.onboardingComplete ?? false
  }, [user, isLoaded])

  const getOnboardingData = useCallback(() => {
    if (!user || !isLoaded) return null
    const metadata = user.unsafeMetadata as { onboardingData?: any } | undefined
    return metadata?.onboardingData ?? null
  }, [user, isLoaded])

  return {
    user,
    isLoaded,
    signOut: handleSignOut,
    isOnboarded: isOnboarded(),
    onboardingData: getOnboardingData(),
  }
}
