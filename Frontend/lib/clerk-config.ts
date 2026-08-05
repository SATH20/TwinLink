/**
 * Clerk Configuration for TwinLink
 * 
 * This file contains the Clerk authentication setup and utilities.
 * Environment variables are loaded from .env.local
 */

export const clerkConfig = {
  // These are automatically loaded from NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // and other environment variables by Clerk SDK
  
  // Sign in/up URLs
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/signup",
  
  // Redirect URLs after authentication
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/onboarding",
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/onboarding",
}

/**
 * Supported OAuth providers
 */
export const OAUTH_PROVIDERS = {
  GOOGLE: "oauth_google" as const,
  GITHUB: "oauth_github" as const,
} as const

export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS]
