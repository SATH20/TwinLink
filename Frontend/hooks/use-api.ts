"use client"

// ============================================================
// TwinLink Data Hooks — React hooks for fetching backend data
// with loading/error states. Uses the centralized API client.
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@clerk/nextjs"
import { createApiClient, ApiError } from "@/lib/api"
import type {
  User,
  Profile,
  Twin,
  Match,
  Conversation,
  AppNotification,
} from "@/lib/types"

// ── Generic Fetch Hook ───────────────────────────────────────

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | Error | null
  refetch: () => void
}

/**
 * Generic hook that fetches data from the API on mount
 * and provides loading/error states + a refetch function.
 *
 * @param fetcher - async function that receives the API client and returns data
 * @param deps   - additional dependency array items to trigger refetch
 */
function useApiQuery<T>(
  fetcher: (
    api: ReturnType<typeof createApiClient>
  ) => Promise<T>,
  deps: unknown[] = []
): UseApiState<T> {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | Error | null>(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const api = createApiClient(getToken)
      const result = await fetcher(api)
      if (mountedRef.current) {
        setData(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof ApiError || err instanceof Error
            ? err
            : new Error("Unknown error")
        )
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, getToken, ...deps])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => {
      mountedRef.current = false
    }
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// ── API Client Hook ──────────────────────────────────────────

/**
 * Returns a ready-to-use API client instance.
 * Use this for imperative calls (mutations, form submissions).
 *
 * @example
 * ```tsx
 * const api = useApiClient()
 * const handleSave = async () => {
 *   await api.profiles.update({ interests: ["AI", "Travel"] })
 * }
 * ```
 */
export function useApiClient() {
  const { getToken } = useAuth()
  return createApiClient(getToken)
}

// ── Data Hooks ───────────────────────────────────────────────

/** Fetch the current authenticated user from the backend */
export function useCurrentUser() {
  return useApiQuery<User>((api) => api.users.me())
}

/** Fetch the current user's profile */
export function useProfile() {
  return useApiQuery<Profile>((api) => api.profiles.me())
}

/** Fetch the current user's digital twin */
export function useTwin() {
  return useApiQuery<Twin>((api) => api.twins.me())
}

/** Fetch active match recommendations */
export function useMatchRecommendations() {
  return useApiQuery<Match[]>((api) => api.matching.recommendations())
}

/** Fetch full match history */
export function useMatchHistory() {
  return useApiQuery<Match[]>((api) => api.matching.history())
}

/** Fetch all conversations for the current user */
export function useConversations() {
  return useApiQuery<Conversation[]>((api) => api.conversations.list())
}

/** Fetch a specific conversation by ID */
export function useConversation(conversationId: string | null) {
  return useApiQuery<Conversation>(
    (api) => api.conversations.get(conversationId!),
    [conversationId]
  )
}

/** Fetch all notifications */
export function useNotifications() {
  return useApiQuery<AppNotification[]>((api) => api.notifications.list())
}

/** Fetch unread notifications only */
export function useUnreadNotifications() {
  return useApiQuery<AppNotification[]>((api) => api.notifications.unread())
}

/** Get the unread notification count (lightweight) */
export function useUnreadCount() {
  const { data, isLoading, error, refetch } = useUnreadNotifications()
  return {
    count: data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ── Polling Hook ─────────────────────────────────────────────

/**
 * Polls a fetcher at a given interval until a condition is met.
 * Useful for waiting on async operations like twin generation.
 *
 * @example
 * ```tsx
 * const { data: twin, isDone } = usePoll(
 *   (api) => api.twins.me(),
 *   (twin) => twin.status === "ACTIVE",
 *   2000 // poll every 2 seconds
 * )
 * ```
 */
export function usePoll<T>(
  fetcher: (api: ReturnType<typeof createApiClient>) => Promise<T>,
  isDoneCheck: (data: T) => boolean,
  intervalMs: number = 2000
) {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    if (!isLoaded || !isSignedIn) return

    const api = createApiClient(getToken)
    let timeoutId: NodeJS.Timeout

    const poll = async () => {
      try {
        const result = await fetcher(api)
        if (!mountedRef.current) return

        setData(result)

        if (isDoneCheck(result)) {
          setIsDone(true)
        } else {
          timeoutId = setTimeout(poll, intervalMs)
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err instanceof Error ? err : new Error("Polling failed")
          )
        }
      }
    }

    poll()

    return () => {
      mountedRef.current = false
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, intervalMs])

  return { data, isDone, error }
}
