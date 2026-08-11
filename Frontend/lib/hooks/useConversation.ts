/**
 * Hook for managing twin conversation state and API calls
 */

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  startConversation as apiStartConversation,
  getConversation as apiGetConversation,
  getUserConversations as apiGetUserConversations,
  getTwin as apiGetTwin,
  getUserProfile as apiGetUserProfile,
  acceptIntroduction as apiAcceptIntroduction,
  createConnection as apiCreateConnection,
  getConnections as apiGetConnections,
  acceptConnection as apiAcceptConnection,
  getFriendlyErrorMessage,
} from '@/lib/api-client'
import type { Conversation } from '@/lib/types/conversation'
import type {
  TwinResponse,
  ProfileResponse,
  ConversationResponse,
  AcceptIntroductionResponse,
} from '@/lib/api-client'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * Normalize a raw conversation response from the backend into a fully-typed
 * Conversation, guaranteeing every field has a defined value so the UI never
 * touches an undefined property.
 */
function normalizeConversation(result: ConversationResponse): Conversation {
  return {
    id: result.id,
    twinA: result.twinA,
    twinB: result.twinB,
    userA: result.userA,
    userB: result.userB,
    messages: Array.isArray(result.messages) ? result.messages : [],
    summary: result.summary || '',
    topicsDiscussed: Array.isArray(result.topicsDiscussed) ? result.topicsDiscussed : [],
    emotionalTone: result.emotionalTone || '',
    compatibilityScore: typeof result.compatibilityScore === 'number' ? result.compatibilityScore : 0,
    confidenceScore: typeof result.confidenceScore === 'number' ? result.confidenceScore : 0,
    strengths: Array.isArray(result.strengths) ? result.strengths : [],
    weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
    recommendation: result.recommendation || '',
    detailedAnalysis: result.detailedAnalysis ?? null,
    reasoningIterations:
      typeof result.reasoningIterations === 'number' && result.reasoningIterations > 0
        ? result.reasoningIterations
        : Array.isArray(result.messages)
          ? result.messages.length
          : 0,
    analysisComplete: Boolean(result.analysisComplete),
    matchId: result.matchId ?? null,
    status: result.status,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }
}

export function useConversation() {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])

  const startConversation = useCallback(
    async (targetUserId: string, context?: string, maxTurns?: number): Promise<Conversation> => {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        const result = await apiStartConversation(token, targetUserId, context, maxTurns)

        if (isDev) {
          console.log('[Conversation API response]', result)
        }

        const normalized = normalizeConversation(result)
        setConversation(normalized)
        return normalized
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getToken]
  )

  const getConversation = useCallback(
    async (conversationId: string): Promise<Conversation> => {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        const result = await apiGetConversation(token, conversationId)

        if (isDev) {
          console.log('[Compatibility response]', {
            compatibilityScore: result.compatibilityScore,
            confidenceScore: result.confidenceScore,
            recommendation: result.recommendation,
            analysisComplete: result.analysisComplete,
          })
        }

        const normalized = normalizeConversation(result)
        setConversation(normalized)
        return normalized
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getToken]
  )

  const getUserConversations = useCallback(async (): Promise<Conversation[]> => {
    setLoading(true)
    setError(null)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const result = await apiGetUserConversations(token)
      const list = Array.isArray(result) ? result : []
      const normalized = list.map(normalizeConversation)

      setConversations(normalized)
      return normalized
    } catch (err) {
      const errorMessage = getFriendlyErrorMessage(err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const getMyTwin = useCallback(async (): Promise<TwinResponse | null> => {
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      return await apiGetTwin(token)
    } catch (err) {
      const errorMessage = getFriendlyErrorMessage(err)
      setError(errorMessage)
      return null
    }
  }, [getToken])

  const getTargetUserProfile = useCallback(
    async (userId: string): Promise<ProfileResponse | null> => {
      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        return await apiGetUserProfile(token, userId)
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        return null
      }
    },
    [getToken]
  )

  const acceptIntroduction = useCallback(
    async (matchId: string): Promise<AcceptIntroductionResponse> => {
      setAccepting(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        const result = await apiAcceptIntroduction(token, matchId)

        if (isDev) {
          console.log('[Recommendation response]', result)
        }

        return result
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setAccepting(false)
      }
    },
    [getToken]
  )

  const createConnection = useCallback(
    async (targetUserId: string, conversationId: string) => {
      setAccepting(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        const result = await apiCreateConnection(token, targetUserId, conversationId)

        if (isDev) {
          console.log('[Connection created]', result)
        }

        return result
      } catch (err) {
        // Don't show error if connection already exists - this is expected
        const errorMessage = getFriendlyErrorMessage(err)
        if (!errorMessage.includes('already exists')) {
          setError(errorMessage)
        }
        throw err
      } finally {
        setAccepting(false)
      }
    },
    [getToken]
  )

  const getConnectionByConversation = useCallback(
    async (conversationId: string) => {
      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        const connections = await apiGetConnections(token, undefined, conversationId)
        return connections.length > 0 ? connections[0] : null
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        return null
      }
    },
    [getToken]
  )

  /**
   * Resolve the single Connection record between the current user and another
   * user (in either direction). This is the source of truth for connection
   * status in the twin conversation view — independent of which conversation
   * happens to be open, so an already-accepted connection is always reflected.
   */
  const getConnectionByUsers = useCallback(
    async (otherUserId: string) => {
      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        // getConnections only returns connections the current user is part of,
        // so matching the *other* participant uniquely identifies the record.
        const connections = await apiGetConnections(token)
        return (
          connections.find(
            (c) => c.currentUserId === otherUserId || c.targetUserId === otherUserId
          ) ?? null
        )
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        return null
      }
    },
    [getToken]
  )

  /**
   * Accept an incoming connection request (the current user is the recipient).
   */
  const acceptConnectionRequest = useCallback(
    async (connectionId: string) => {
      setAccepting(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Authentication required')
        }

        return await apiAcceptConnection(token, connectionId)
      } catch (err) {
        const errorMessage = getFriendlyErrorMessage(err)
        setError(errorMessage)
        throw err
      } finally {
        setAccepting(false)
      }
    },
    [getToken]
  )

  return {
    conversation,
    conversations,
    loading,
    accepting,
    error,
    startConversation,
    getConversation,
    getUserConversations,
    getMyTwin,
    getTargetUserProfile,
    acceptIntroduction,
    createConnection,
    getConnectionByConversation,
    getConnectionByUsers,
    acceptConnectionRequest,
    setConversation,
    setError,
  }
}
