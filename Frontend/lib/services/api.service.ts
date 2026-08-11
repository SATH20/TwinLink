/**
 * API Service Layer
 * Central service for all backend API calls
 */

import { User, Profile, Twin, DashboardData, Match, MatchRecommendation } from '../types/api.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Base fetch wrapper with authentication and error handling
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const jsonResponse = await response.json()
    
    // Handle wrapped responses from backend TransformInterceptor
    // Backend wraps responses in { success: true, data: T, meta: {...} } format
    if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
      console.log('[API] Unwrapping response:', endpoint, jsonResponse)
      return jsonResponse.data as T
    }
    
    // Return unwrapped response if not in wrapped format
    console.log('[API] Direct response:', endpoint, jsonResponse)
    return jsonResponse as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0
    )
  }
}

/**
 * Get Clerk session token
 */
async function getAuthToken(): Promise<string | null> {
  try {
    // This will be injected by Clerk's session hook
    if (typeof window !== 'undefined') {
      const { getToken } = await import('@clerk/nextjs')
      // @ts-ignore - getToken is available in client components
      return await window.__clerk_session?.getToken()
    }
    return null
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

/**
 * API Service Methods
 */
export const apiService = {
  /**
   * Sync the current Clerk user with the backend, ensuring the real display
   * name is stored (and backfilled for users previously saved as "Anonymous").
   */
  async syncUser(token: string, name?: string): Promise<{ userId: string; email: string; name: string; isNewUser: boolean }> {
    return fetchWithAuth('/v1/auth/register', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name ?? '' }),
    })
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(token: string): Promise<User> {
    return fetchWithAuth<User>('/v1/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get current user's profile
   */
  async getCurrentProfile(token: string): Promise<Profile> {
    return fetchWithAuth<Profile>('/v1/profiles/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get current user's digital twin
   */
  async getCurrentTwin(token: string): Promise<Twin> {
    return fetchWithAuth<Twin>('/v1/twins/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get all dashboard data in parallel
   */
  async getDashboardData(token: string): Promise<DashboardData> {
    const [user, profile, twin] = await Promise.allSettled([
      this.getCurrentUser(token),
      this.getCurrentProfile(token),
      this.getCurrentTwin(token),
    ])

    return {
      user: user.status === 'fulfilled' ? user.value : null!,
      profile: profile.status === 'fulfilled' ? profile.value : null,
      twin: twin.status === 'fulfilled' ? twin.value : null,
    }
  },

  /**
   * Get current user's profile (full details for My Twin page)
   */
  async getProfileDetails(token: string): Promise<Profile> {
    return fetchWithAuth<Profile>('/v1/profiles/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get current user's twin (full details for My Twin page)
   */
  async getTwinDetails(token: string): Promise<Twin> {
    return fetchWithAuth<Twin>('/v1/twins/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get match recommendations for current user
   */
  async getRecommendations(token: string): Promise<Match[]> {
    return fetchWithAuth<Match[]>('/v1/matching/recommendations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Start matching process (trigger AI to find matches).
   * Returns diagnostics so the UI can explain the outcome instead of silently
   * doing nothing: how many candidates were found, how big the pool was, and
   * how many were eliminated by the hard-constraint filters.
   */
  async startMatching(
    token: string,
    maxCandidates: number = 10
  ): Promise<{
    candidatesFound: number
    totalCandidates: number
    eliminated: number
    persisted: number
    eliminationReasons: Record<string, number>
    candidates: any[]
  }> {
    return fetchWithAuth('/v1/matching/start', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ maxCandidates }),
    })
  },

  /**
   * Get match history for current user
   */
  async getMatchHistory(token: string): Promise<Match[]> {
    return fetchWithAuth<Match[]>('/v1/matching/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get user profile by user ID (for displaying matched user info)
   */
  async getUserProfile(token: string, userId: string): Promise<Profile> {
    return fetchWithAuth<Profile>(`/v1/profiles/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  /**
   * Get user by user ID
   */
  async getUser(token: string, userId: string): Promise<User> {
    return fetchWithAuth<User>(`/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}

export { ApiError }
