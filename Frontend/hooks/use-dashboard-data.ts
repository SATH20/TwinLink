"use client"

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { apiService, ApiError } from '@/lib/services/api.service'
import { DashboardData } from '@/lib/types/api.types'

interface UseDashboardDataReturn {
  data: DashboardData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch dashboard data
 * Handles loading, error states, and authentication
 */
export function useDashboardData(): UseDashboardDataReturn {
  const { getToken, isLoaded } = useAuth()
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const [data, setData] = useState<DashboardData | null>(null)
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

      // Ensure the backend has this user's real display name synced from Clerk.
      // This backfills existing users previously stored as "Anonymous".
      const clerkName =
        clerkUser?.fullName ||
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
        undefined
      try {
        await apiService.syncUser(token, clerkName)
      } catch (syncErr) {
        console.warn('User sync warning (non-fatal):', syncErr)
      }

      const dashboardData = await apiService.getDashboardData(token)
      setData(dashboardData)
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isLoaded, userLoaded])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
