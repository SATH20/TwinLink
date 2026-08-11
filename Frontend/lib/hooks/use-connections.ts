/**
 * Hook for managing connections state and API calls
 */

import { useState, useCallback, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import {
  getConnections as apiGetConnections,
  acceptConnection as apiAcceptConnection,
  declineConnection as apiDeclineConnection,
  getUserProfile as apiGetUserProfile,
  getFriendlyErrorMessage,
  ConnectionResponse,
} from '@/lib/api-client'
import type { ConnectionWithProfile } from '@/lib/types/api.types'

export function useConnections() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [declining, setDeclining] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connections, setConnections] = useState<ConnectionWithProfile[]>([])

  const fetchConnections = useCallback(
    async (status?: 'PENDING' | 'ACCEPTED' | 'DECLINED') => {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        const result = await apiGetConnections(token, status)
        
        // Enrich connections with user profile data
        const enriched = await Promise.all(
          result.map(async (conn: ConnectionResponse) => {
            const currentUserId = user?.id || ''
            const isReceiver = conn.targetUserId === currentUserId
            const otherUserId = isReceiver ? conn.currentUserId : conn.targetUserId

            try {
              const otherProfile = await apiGetUserProfile(token, otherUserId)
              const currentProfile = await apiGetUserProfile(token, currentUserId)
              
              return {
                ...conn,
                targetProfile: isReceiver ? currentProfile : otherProfile,
                currentProfile: isReceiver ? otherProfile : currentProfile,
              } as ConnectionWithProfile
            } catch {
              return conn as ConnectionWithProfile
            }
          })
        )

        setConnections(enriched)
        return enriched
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getToken, user?.id]
  )

  const acceptConnection = useCallback(
    async (connectionId: string) => {
      setAccepting(connectionId)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        await apiAcceptConnection(token, connectionId)
        
        // Refresh connections after accepting
        await fetchConnections()
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setAccepting(null)
      }
    },
    [getToken, fetchConnections]
  )

  const declineConnection = useCallback(
    async (connectionId: string) => {
      setDeclining(connectionId)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        await apiDeclineConnection(token, connectionId)
        
        // Refresh connections after declining
        await fetchConnections()
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setDeclining(null)
      }
    },
    [getToken, fetchConnections]
  )

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  return {
    connections,
    loading,
    accepting,
    declining,
    error,
    fetchConnections,
    acceptConnection,
    declineConnection,
  }
}
