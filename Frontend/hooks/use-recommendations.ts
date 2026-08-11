"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { apiService } from '@/lib/services/api.service'
import { Match, MatchRecommendation, User, Profile } from '@/lib/types/api.types'

interface MatchRunInfo {
  candidatesFound: number
  totalCandidates: number
  eliminated: number
  persisted: number
  eliminationReasons: Record<string, number>
}

interface UseRecommendationsReturn {
  recommendations: MatchRecommendation[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  startMatching: (maxCandidates?: number) => Promise<void>
  isStartingMatch: boolean
  /** Error produced specifically by the "Start Matching" action (shown inline). */
  matchError: Error | null
  /** Summary of the last matching run, so the UI never silently does nothing. */
  matchInfo: MatchRunInfo | null
}

/**
 * Custom hook to fetch match recommendations
 * Fetches recommendations and enriches them with user/profile data
 */
export function useRecommendations(): UseRecommendationsReturn {
  const { getToken, isLoaded, userId } = useAuth()
  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStartingMatch, setIsStartingMatch] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [matchError, setMatchError] = useState<Error | null>(null)
  const [matchInfo, setMatchInfo] = useState<MatchRunInfo | null>(null)

  const fetchData = async () => {
    if (!isLoaded || !userId) return

    setIsLoading(true)
    setError(null)

    try {
      const token = await getToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      // Fetch recommendations
      const matches = await apiService.getRecommendations(token)

      console.log('[Recommendations] Raw API response:', matches)

      // Validate response is an array
      if (!Array.isArray(matches)) {
        console.error('[Recommendations] Expected array, got:', typeof matches, matches)
        throw new Error('Invalid recommendations response format')
      }

      // Enrich each match with user and profile data
      const enrichedMatches = await Promise.all(
        matches.map(async (match) => {
          try {
            // Determine which user is the "other" user (not current user)
            const matchedUserId = match.userA === userId ? match.userB : match.userA

            // Fetch matched user's profile in parallel
            const [matchedProfile] = await Promise.allSettled([
              apiService.getUserProfile(token, matchedUserId),
            ])

            return {
              ...match,
              matchedProfile: matchedProfile.status === 'fulfilled' ? matchedProfile.value : undefined,
            } as MatchRecommendation
          } catch (err) {
            console.error('Error enriching match:', err)
            return match as MatchRecommendation
          }
        })
      )

      console.log('[Recommendations] Enriched matches:', enrichedMatches)
      setRecommendations(enrichedMatches)
    } catch (err) {
      console.error('Recommendations fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'))
    } finally {
      setIsLoading(false)
    }
  }

  const startMatching = async (maxCandidates: number = 10) => {
    // Never fail silently: if auth isn't ready, surface an actionable error.
    if (!isLoaded) return
    if (!userId) {
      setMatchError(new Error('You must be signed in to start the matching process.'))
      return
    }

    setIsStartingMatch(true)
    setMatchError(null)
    setMatchInfo(null)

    try {
      const token = await getToken()

      if (!token) {
        throw new Error('No authentication token available')
      }

      const result = await apiService.startMatching(token, maxCandidates)
      console.log('[Recommendations] Start matching result:', result)

      // Record the outcome so the UI can always show *something*.
      setMatchInfo({
        candidatesFound: result?.candidatesFound ?? 0,
        totalCandidates: result?.totalCandidates ?? 0,
        eliminated: result?.eliminated ?? 0,
        persisted: result?.persisted ?? 0,
        eliminationReasons: result?.eliminationReasons ?? {},
      })

      // Refetch recommendations so newly-created matches appear automatically
      // (no manual page/database refresh needed).
      await fetchData()
    } catch (err) {
      console.error('Start matching error:', err)
      setMatchError(err instanceof Error ? err : new Error('Failed to start matching'))
    } finally {
      setIsStartingMatch(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isLoaded, userId])

  return {
    recommendations,
    isLoading,
    error,
    refetch: fetchData,
    startMatching,
    isStartingMatch,
    matchError,
    matchInfo,
  }
}
