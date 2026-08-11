/**
 * Hook for managing notifications state and API calls.
 * Notifications are the real, per-recipient records created by the backend
 * (e.g. when someone sends or accepts a connection request), so the sender and
 * the recipient always see the correct message for their own side.
 */

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  getNotifications as apiGetNotifications,
  markNotificationAsRead as apiMarkNotificationAsRead,
  getFriendlyErrorMessage,
  type NotificationResponse,
} from '@/lib/api-client'

export function useNotifications() {
  const { getToken } = useAuth()
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const result = await apiGetNotifications(token)
      setNotifications(Array.isArray(result) ? result : [])
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistic update — the read state is not critical to correctness.
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      try {
        const token = await getToken()
        if (token) await apiMarkNotificationAsRead(token, id)
      } catch {
        // Ignore — a failed read-marking is non-fatal.
      }
    },
    [getToken]
  )

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      const token = await getToken()
      if (token) {
        await Promise.all(unread.map((n) => apiMarkNotificationAsRead(token, n.id)))
      }
    } catch {
      // Ignore — non-fatal.
    }
  }, [getToken, notifications])

  // Local-only dismissal (there is no backend delete endpoint).
  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismiss,
  }
}
