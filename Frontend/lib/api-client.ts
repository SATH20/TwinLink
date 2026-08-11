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

    // The backend wraps every successful response with a global
    // TransformInterceptor: { success: true, data: T, meta: {...} }.
    // Unwrap `data` so callers receive the actual payload (otherwise every
    // field reads as undefined and the UI renders an empty conversation).
    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      return body.data as T
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
  name: string
  isNewUser: boolean
  message: string
}

/**
 * Register/sync the current Clerk user with the backend.
 * Creates the user in Firestore if they don't exist.
 * Pass the Clerk display name so the backend stores a real name.
 */
export async function registerUser(token: string, name?: string): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/v1/auth/register", token, {
    method: "POST",
    body: JSON.stringify({ name: name ?? "" }),
  })
}

// ============================================================
// Profile Endpoints
// ============================================================

export interface ProfilePrivacy {
  profileVisibility: "public" | "connections"
  includeInMatching: boolean
}

export interface NotificationPreferences {
  connectionRequests: boolean
  connectionAccepted: boolean
  newMessages: boolean
  twinUpdates: boolean
}

export interface ProfileResponse {
  id: string
  userId: string
  name?: string
  avatar?: string
  age?: number
  gender?: string
  bio?: string
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
  privacy?: ProfilePrivacy
  notificationPreferences?: NotificationPreferences
  limitedVisibility?: boolean
  completenessScore: number
  createdAt: string
  updatedAt: string
}

/**
 * Get the current user's own profile (full detail, including settings).
 */
export async function getMyProfile(token: string): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>("/v1/profiles/me", token, { method: "GET" })
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

/**
 * Update privacy and/or notification-preference settings (independent sections).
 */
export async function updateSettings(
  token: string,
  data: { privacy?: Partial<ProfilePrivacy>; notificationPreferences?: Partial<NotificationPreferences> }
): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>("/v1/profiles/me/settings", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// ============================================================
// Current User (account) Endpoints
// ============================================================

export interface AccountUser {
  id: string
  clerkId: string
  email: string
  name: string
  username?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

/**
 * Get the current user's application account record.
 */
export async function getMyAccount(token: string): Promise<AccountUser> {
  return apiRequest<AccountUser>("/v1/users/me", token, { method: "GET" })
}

/**
 * Update editable account fields (name, username, phone). Email stays owned by Clerk.
 */
export async function updateMyAccount(
  token: string,
  data: { name?: string; username?: string; phone?: string }
): Promise<AccountUser> {
  return apiRequest<AccountUser>("/v1/users/me", token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Permanently delete the current user's account and all associated data
 * (profile, twin, connections, messages) plus the Clerk user.
 */
export async function deleteMyAccount(token: string): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>("/v1/users/me", token, { method: "DELETE" })
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

/**
 * Update the current user's Digital Twin (status and/or custom instructions).
 */
export async function updateTwin(
  token: string,
  data: { status?: string; customPromptAdditions?: string }
): Promise<TwinResponse> {
  return apiRequest<TwinResponse>("/v1/twins/me", token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Get another user's profile by their user ID.
 * Used to display the selected/matched user's twin details.
 */
export async function getUserProfile(
  token: string,
  userId: string
): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>(`/v1/profiles/${userId}`, token, {
    method: "GET",
  })
}

// ============================================================
// Conversation Endpoints
// ============================================================

export interface ConversationMessage {
  role: 'twin_a' | 'twin_b'
  content: string
  timestamp: string
}

export interface CompatibilityDetailedAnalysis {
  emotional: number
  intellectual: number
  lifestyle: number
  values: number
  communication: number
}

export interface ConversationResponse {
  id: string
  twinA: string
  twinB: string
  userA: string
  userB: string
  messages: ConversationMessage[]
  summary: string
  topicsDiscussed: string[]
  emotionalTone: string
  compatibilityScore: number
  confidenceScore: number
  strengths: string[]
  weaknesses: string[]
  recommendation: 'STRONG_MATCH' | 'GOOD_MATCH' | 'MODERATE_MATCH' | 'WEAK_MATCH' | 'NO_MATCH' | ''
  detailedAnalysis: CompatibilityDetailedAnalysis | null
  reasoningIterations: number
  analysisComplete: boolean
  matchId: string | null
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

/**
 * Start a conversation between the current user's twin and a target user's twin.
 */
export async function startConversation(
  token: string,
  targetUserId: string,
  context?: string,
  maxTurns?: number
): Promise<ConversationResponse> {
  return apiRequest<ConversationResponse>("/v1/conversation/start", token, {
    method: "POST",
    body: JSON.stringify({
      targetUserId,
      context: context || "first_meeting",
      maxTurns: maxTurns || 10,
    }),
  })
}

/**
 * Get a specific conversation by ID.
 */
export async function getConversation(
  token: string,
  conversationId: string
): Promise<ConversationResponse> {
  return apiRequest<ConversationResponse>(`/v1/conversation/${conversationId}`, token, {
    method: "GET",
  })
}

/**
 * Get all conversations for the current user.
 */
export async function getUserConversations(token: string): Promise<ConversationResponse[]> {
  return apiRequest<ConversationResponse[]>("/v1/conversation", token, {
    method: "GET",
  })
}

// ============================================================
// Matching / Introduction Endpoints
// ============================================================

export interface AcceptIntroductionResponse {
  success: boolean
  match: {
    id: string
    userA: string
    userB: string
    status: string
    conversationId?: string
    compatibilityScore: number
  }
}

/**
 * Accept an introduction for a match. On success the backend transitions the
 * match to ACTIVE (unlocking the human chat) and notifies the other user.
 */
export async function acceptIntroduction(
  token: string,
  matchId: string
): Promise<AcceptIntroductionResponse> {
  return apiRequest<AcceptIntroductionResponse>(`/v1/matching/${matchId}/accept`, token, {
    method: "POST",
    body: JSON.stringify({}),
  })
}

// ============================================================
// Connection Endpoints
// ============================================================

export interface ConnectionResponse {
  id: string
  currentUserId: string
  targetUserId: string
  conversationId: string
  compatibilityScore: number
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: string
  updatedAt: string
}

/**
 * Create a connection request after a completed AI conversation.
 */
export async function createConnection(
  token: string,
  targetUserId: string,
  conversationId: string
): Promise<ConnectionResponse> {
  return apiRequest<ConnectionResponse>("/v1/connections", token, {
    method: "POST",
    body: JSON.stringify({ targetUserId, conversationId }),
  })
}

/**
 * Get all connections for the current user.
 */
export async function getConnections(
  token: string,
  status?: 'PENDING' | 'ACCEPTED' | 'DECLINED',
  conversationId?: string
): Promise<ConnectionResponse[]> {
  let url = "/v1/connections"
  const params = new URLSearchParams()
  if (status) params.append("status", status)
  if (conversationId) params.append("conversationId", conversationId)
  if (params.toString()) url += `?${params.toString()}`
  
  return apiRequest<ConnectionResponse[]>(url, token, {
    method: "GET",
  })
}

/**
 * Get a single connection by its ID. Used by the human chat page to resolve the
 * connection status and the two participants.
 */
export async function getConnectionById(
  token: string,
  connectionId: string
): Promise<ConnectionResponse> {
  return apiRequest<ConnectionResponse>(`/v1/connections/${connectionId}`, token, {
    method: "GET",
  })
}

/**
 * Accept a connection request.
 */
export async function acceptConnection(
  token: string,
  connectionId: string
): Promise<ConnectionResponse> {
  return apiRequest<ConnectionResponse>(`/v1/connections/${connectionId}/accept`, token, {
    method: "PATCH",
  })
}

/**
 * Decline a connection request.
 */
export async function declineConnection(
  token: string,
  connectionId: string
): Promise<ConnectionResponse> {
  return apiRequest<ConnectionResponse>(`/v1/connections/${connectionId}/decline`, token, {
    method: "PATCH",
  })
}

// ============================================================
// Human Chat / Message Endpoints
// ============================================================

export interface MessageResponse {
  id: string
  connectionId: string
  senderId: string
  content: string
  createdAt: string
  updatedAt?: string
}

/**
 * Get the human chat history for a connection (oldest → newest).
 * The backend only returns messages when the connection is ACCEPTED and the
 * current user is a participant.
 */
export async function getMessages(
  token: string,
  connectionId: string
): Promise<MessageResponse[]> {
  return apiRequest<MessageResponse[]>(`/v1/connections/${connectionId}/messages`, token, {
    method: "GET",
  })
}

/**
 * Send (persist) a human chat message in a connection.
 */
export async function sendMessage(
  token: string,
  connectionId: string,
  content: string
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>(`/v1/connections/${connectionId}/messages`, token, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
}

// ============================================================
// Notification Endpoints
// ============================================================

export interface NotificationResponse {
  id: string
  userId: string
  type:
    | 'MATCH_FOUND'
    | 'CONVERSATION_COMPLETE'
    | 'TWIN_UPDATED'
    | 'CONNECTION_REQUEST'
    | 'CONNECTION_ACCEPTED'
    | string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  createdAt: string
}

/**
 * Get all notifications for the current user (newest first).
 */
export async function getNotifications(token: string): Promise<NotificationResponse[]> {
  return apiRequest<NotificationResponse[]>("/v1/notifications", token, {
    method: "GET",
  })
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(
  token: string,
  notificationId: string
): Promise<void> {
  return apiRequest<void>(`/v1/notifications/${notificationId}/read`, token, {
    method: "PATCH",
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
      if (error.message.includes("busy")) {
        return "One or both twins are currently in another conversation. Please try again shortly."
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
