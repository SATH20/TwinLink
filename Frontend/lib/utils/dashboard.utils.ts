/**
 * Dashboard Utility Functions
 * Helpers for formatting and transforming dashboard data
 */

import { Twin, TwinStatus, Profile } from '../types/api.types'
import { formatDistanceToNow } from 'date-fns'

/**
 * Get human-readable twin status
 */
export function getTwinStatusLabel(status: TwinStatus): string {
  const statusLabels: Record<TwinStatus, string> = {
    [TwinStatus.AWAKE]: 'Active',
    [TwinStatus.ASLEEP]: 'Resting',
    [TwinStatus.EXPLORING]: 'Exploring Network',
    [TwinStatus.CONVERSING]: 'In Conversation',
    [TwinStatus.LEARNING]: 'Learning',
  }
  return statusLabels[status] || 'Unknown'
}

/**
 * Get twin status color
 */
export function getTwinStatusColor(status: TwinStatus): {
  text: string
  bg: string
  border: string
} {
  const colors: Record<TwinStatus, { text: string; bg: string; border: string }> = {
    [TwinStatus.AWAKE]: {
      text: 'text-green-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    [TwinStatus.ASLEEP]: {
      text: 'text-gray-600',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
    },
    [TwinStatus.EXPLORING]: {
      text: 'text-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    [TwinStatus.CONVERSING]: {
      text: 'text-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    [TwinStatus.LEARNING]: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  }
  return colors[status] || colors[TwinStatus.ASLEEP]
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (error) {
    return 'Unknown'
  }
}

/**
 * Calculate twin health percentage
 * Based on version, last wake, and memory size
 */
export function calculateTwinHealth(twin: Twin): number {
  if (!twin) return 0

  let health = 100

  // Penalize if twin hasn't been active recently
  const lastWakeDate = new Date(twin.lastWake)
  const daysSinceLastWake = (Date.now() - lastWakeDate.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceLastWake > 7) {
    health -= Math.min(20, daysSinceLastWake * 2)
  }

  // Bonus for having conversations and insights
  const conversationCount = twin.memory?.conversations?.length || 0
  const insightCount = twin.memory?.insights?.length || 0
  
  if (conversationCount > 10) health = Math.min(100, health + 5)
  if (insightCount > 5) health = Math.min(100, health + 5)

  return Math.max(0, Math.min(100, Math.round(health)))
}

/**
 * Get twin mission based on status
 */
export function getTwinMission(twin: Twin): string {
  if (!twin) return 'Initializing...'

  const missions: Record<TwinStatus, string> = {
    [TwinStatus.AWAKE]: 'Ready to explore the network',
    [TwinStatus.ASLEEP]: 'Resting and processing insights',
    [TwinStatus.EXPLORING]: 'Searching for meaningful connections',
    [TwinStatus.CONVERSING]: 'Engaging with compatible twins',
    [TwinStatus.LEARNING]: 'Learning from recent interactions',
  }

  return missions[twin.status] || 'Processing...'
}

/**
 * Calculate learning progress based on memory
 */
export function calculateLearningProgress(twin: Twin): number {
  if (!twin || !twin.memory) return 0

  const conversationCount = twin.memory.conversations?.length || 0
  const insightCount = twin.memory.insights?.length || 0
  const matchHistoryCount = twin.memory.matchHistory?.length || 0

  // Calculate progress based on interaction counts
  const totalInteractions = conversationCount + insightCount + matchHistoryCount
  const maxInteractions = 100 // Cap at 100 interactions for 100%

  return Math.min(100, Math.round((totalInteractions / maxInteractions) * 100))
}

/**
 * Get AI-generated summary based on twin data
 */
export function generateTwinSummary(twin: Twin, profile: Profile | null): string {
  if (!twin) return 'Your Digital Twin is being initialized...'

  const conversationCount = twin.memory?.conversations?.length || 0
  const insightCount = twin.memory?.insights?.length || 0
  
  if (conversationCount === 0) {
    return 'Your Twin is ready to start exploring the network and finding meaningful connections.'
  }

  if (conversationCount < 5) {
    return `Your Twin is actively learning about you. ${conversationCount} conversations completed so far.`
  }

  if (insightCount > 3) {
    return `Your Twin has discovered ${insightCount} insights about your preferences and is actively searching for highly compatible matches.`
  }

  return `Your Twin is performing well with ${conversationCount} conversations and ${insightCount} insights discovered.`
}

/**
 * Get user initials from name
 */
export function getUserInitials(name: string): string {
  if (!name) return 'U'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Format profile completeness
 */
export function getProfileCompletenessLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Incomplete'
}
