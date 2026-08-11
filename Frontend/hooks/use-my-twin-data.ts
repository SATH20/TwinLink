"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { apiService, ApiError } from '@/lib/services/api.service'
import { Twin, Profile } from '@/lib/types/api.types'

interface UseMyTwinDataReturn {
  twin: Twin | null
  profile: Profile | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch My Twin page data
 * Fetches twin and profile details for comprehensive display
 */
export function useMyTwinData(): UseMyTwinDataReturn {
  const { getToken, isLoaded } = useAuth()
  const [twin, setTwin] = useState<Twin | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      const token = await getToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      // Fetch twin and profile data in parallel
      const [twinData, profileData] = await Promise.allSettled([
        apiService.getTwinDetails(token),
        apiService.getProfileDetails(token),
      ])

      setTwin(twinData.status === 'fulfilled' ? twinData.value : null)
      setProfile(profileData.status === 'fulfilled' ? profileData.value : null)

      // If twin fetch failed, throw error
      if (twinData.status === 'rejected') {
        throw twinData.reason
      }
    } catch (err) {
      console.error('My Twin data fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch twin data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isLoaded])

  return {
    twin,
    profile,
    isLoading,
    error,
    refetch: fetchData,
  }
}
