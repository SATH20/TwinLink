"use client"

/**
 * TwinLink API Client
 * Centralized HTTP client for communicating with the NestJS backend.
 * All requests include Clerk Bearer token for authentication.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

/**
 * Custom error class for API errors with structured backend error info.
 */
export class ApiError extends Error {
  status: number
  code: string
  details?: any

  constructor(status: number, message: string, code: string = "UNKNOWN_ERROR", details?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}

/**
 * Makes an authenticated request to the NestJS backend.
 */
async function apiRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    // Parse response body
    let body: any
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      body = await response.json()
    } else {
      body = await response.text()
    }

    if (!response.ok) {
      // Extract error message from NestJS error response format
      const errorMessage =
        body?.message ||
        body?.error ||
        (typeof body === "string" ? body : `Request failed with status ${response.status}`)

      throw new ApiError(
        response.status,
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
        body?.statusCode?.toString() || response.status.toString(),
        body
      )
    }

    return body as T
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error
    }

    // Network errors (backend unreachable, DNS, CORS, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        0,
        "Could not connect to the server. Please check your connection and try again.",
        "NETWORK_ERROR"
      )
    }

    // Other unexpected errors
    throw new ApiError(
      0,
      "An unexpected error occurred. Please try again.",
      "UNEXPECTED_ERROR",
      error
    )
  }
}

// ============================================================
// Auth Endpoints
// ============================================================

export interface RegisterResponse {
  userId: string
  email: string
  isNewUser: boolean
  message: string
}

/**
 * Register/sync the current Clerk user with the backend.
 * Creates the user in Firestore if they don't exist.
 */
export async function registerUser(token: string): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/v1/auth/register", token, {
    method: "POST",
  })
}

// ============================================================
// Profile Endpoints
// ============================================================

export interface ProfileResponse {
  id: string
  userId: string
  age?: number
  gender?: string
  location?: any
  personality?: any
  values?: string[]
  interests?: string[]
  communicationStyle?: string
  goals?: any
  preferences?: any
  dealBreakers?: string[]
  lifestyle?: any
  languages?: string[]
  profession?: any
  completenessScore: number
  createdAt: string
  updatedAt: string
}

/**
 * Update the current user's profile with onboarding data.
 * Backend automatically calculates completeness score.
 */
export async function updateProfile(token: string, data: any): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>("/v1/profiles/me", token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// ============================================================
// Twin Endpoints
// ============================================================

export interface TwinResponse {
  id: string
  userId: string
  systemPrompt: string
  memory: {
    conversations: string[]
    matchHistory: string[]
    insights: string[]
    preferences: Record<string, any>
  }
  status: string
  version: number
  lastWake: string
  nextWake: string
  createdAt: string
  updatedAt: string
}

/**
 * Create a Digital Twin for the current user.
 * Requires profile completeness >= 60%.
 * Backend calls FastAPI to generate the twin's AI personality.
 */
export async function createTwin(token: string): Promise<TwinResponse> {
  return apiRequest<TwinResponse>("/v1/twins/create", token, {
    method: "POST",
    body: JSON.stringify({}),
  })
}

/**
 * Get the current user's Digital Twin.
 */
export async function getTwin(token: string): Promise<TwinResponse> {
  return apiRequest<TwinResponse>("/v1/twins/me", token, {
    method: "GET",
  })
}

// ============================================================
// User-Friendly Error Messages
// ============================================================

/**
 * Converts API errors into user-friendly messages.
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Something went wrong. Please try again."
  }

  switch (error.status) {
    case 0:
      return "Could not connect to the server. Please check your connection and try again."
    case 400:
      if (error.message.includes("60%")) {
        return "Please fill in more profile details before creating your twin."
      }
      return "Some of your profile data couldn't be saved. Please review and try again."
    case 401:
      return "Your session has expired. Please sign in again."
    case 409:
      // Twin already exists — this is actually fine
      return ""
    case 404:
      return "Your profile was not found. Please try again."
    case 500:
      return "We're having trouble generating your twin. Please try again in a moment."
    default:
      return error.message || "Something went wrong. Please try again."
  }
}
