// ============================================================
// TwinLink API Client — centralized fetch wrapper with Clerk
// auth token injection for all backend requests.
// ============================================================

import type {
  User,
  Profile,
  Twin,
  Match,
  Conversation,
  AppNotification,
  LoginResponse,
  MatchingStartResponse,
  CompatibilityResult,
} from "./types"

// ── Configuration ────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

// ── Core Fetch Wrapper ───────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = "ApiError"
  }
}

/**
 * Low-level fetch wrapper that attaches the Clerk Bearer token
 * and handles JSON parsing + error responses.
 *
 * @param path    - API path, e.g. "/v1/users/me"
 * @param token   - Clerk session token from `getToken()`
 * @param options - Standard RequestInit overrides
 */
async function apiFetch<T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Handle no-content responses (204, etc.)
  if (res.status === 204) {
    return undefined as T
  }

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, body)
  }

  return body as T
}

// ── API Client Factory ───────────────────────────────────────
//
// Usage in React components:
//   const { getToken } = useAuth()
//   const client = createApiClient(getToken)
//   const user = await client.users.me()
//
// The getToken function is called fresh for each request to
// ensure the token is always valid (Clerk auto-refreshes).

export function createApiClient(
  getToken: () => Promise<string | null>
) {
  /** Helper: get a fresh token and make a typed request */
  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getToken()
    return apiFetch<T>(path, token, options)
  }

  return {
    // ── Auth ───────────────────────────────────────────────
    auth: {
      /** Register / sync the current Clerk user with the backend */
      register: () =>
        request<LoginResponse>("/v1/auth/register", { method: "POST" }),

      /** Login / sync session */
      login: () =>
        request<LoginResponse>("/v1/auth/login", { method: "POST" }),
    },

    // ── Users ──────────────────────────────────────────────
    users: {
      /** Get the current authenticated user */
      me: () => request<User>("/v1/users/me"),

      /** Update current user */
      update: (data: Partial<Pick<User, "name" | "email">>) =>
        request<User>("/v1/users/me", {
          method: "PUT",
          body: JSON.stringify(data),
        }),
    },

    // ── Profiles ───────────────────────────────────────────
    profiles: {
      /** Get current user's profile (auto-creates skeleton if missing) */
      me: () => request<Profile>("/v1/profiles/me"),

      /** Update current user's profile */
      update: (data: Partial<Profile>) =>
        request<Profile>("/v1/profiles/me", {
          method: "PUT",
          body: JSON.stringify(data),
        }),
    },

    // ── Twins ──────────────────────────────────────────────
    twins: {
      /** Get current user's digital twin */
      me: () => request<Twin>("/v1/twins/me"),

      /** Create / generate a new AI twin (calls Gemini) */
      create: (customPromptAdditions?: string) =>
        request<Twin>("/v1/twins/create", {
          method: "POST",
          body: JSON.stringify({ customPromptAdditions }),
        }),

      /** Update twin configuration */
      update: (
        data: Partial<{ status: string; customPromptAdditions: string }>
      ) =>
        request<Twin>("/v1/twins/me", {
          method: "PUT",
          body: JSON.stringify(data),
        }),
    },

    // ── Matching ───────────────────────────────────────────
    matching: {
      /** Start the matching engine (candidate filter + scoring) */
      start: (maxCandidates: number = 10) =>
        request<MatchingStartResponse>("/v1/matching/start", {
          method: "POST",
          body: JSON.stringify({ maxCandidates }),
        }),

      /** Get active match recommendations */
      recommendations: () =>
        request<Match[]>("/v1/matching/recommendations"),

      /** Get full match history */
      history: () => request<Match[]>("/v1/matching/history"),
    },

    // ── Conversations ──────────────────────────────────────
    conversations: {
      /** Start a twin-to-twin AI conversation */
      start: (targetUserId: string, context?: string, maxTurns?: number) =>
        request<Conversation>("/v1/conversation/start", {
          method: "POST",
          body: JSON.stringify({ targetUserId, context, maxTurns }),
        }),

      /** Get a specific conversation by ID */
      get: (id: string) =>
        request<Conversation>(`/v1/conversation/${id}`),

      /** Get all conversations for the current user */
      list: () => request<Conversation[]>("/v1/conversation"),
    },

    // ── Compatibility ──────────────────────────────────────
    compatibility: {
      /** Analyze compatibility for a conversation */
      analyze: (conversationId: string) =>
        request<CompatibilityResult>("/v1/compatibility/analyze", {
          method: "POST",
          body: JSON.stringify({ conversationId }),
        }),
    },

    // ── Notifications ──────────────────────────────────────
    notifications: {
      /** Get all notifications */
      list: () => request<AppNotification[]>("/v1/notifications"),

      /** Get unread notifications only */
      unread: () => request<AppNotification[]>("/v1/notifications/unread"),

      /** Mark a single notification as read */
      markRead: (id: string) =>
        request<void>(`/v1/notifications/${id}/read`, {
          method: "PATCH",
        }),
    },

    // ── Health ─────────────────────────────────────────────
    health: {
      /** Check backend health (public, no auth needed) */
      check: () =>
        apiFetch<{ status: string; timestamp: string }>(
          "/v1/health/live",
          null
        ),
    },
  }
}

// ── Type Export ───────────────────────────────────────────────
// Re-export for convenience so consumers can do:
//   import { createApiClient, type ApiClient } from "@/lib/api"

export type ApiClient = ReturnType<typeof createApiClient>
