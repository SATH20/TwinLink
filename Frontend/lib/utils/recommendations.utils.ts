/**
 * Recommendations Utility Functions
 * Helpers for transforming match data to UI-ready format
 */

import { Match, MatchRecommendation, Profile, MatchStatus } from '../types/api.types'
import { formatRelativeTime } from './dashboard.utils'

/**
 * Get match status badge styling
 */
export function getMatchStatusColor(status: MatchStatus) {
  const colors = {
    [MatchStatus.PENDING]: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-600',
      border: 'border-yellow-500/20',
      label: 'Pending',
    },
    [MatchStatus.ACTIVE]: {
      bg: 'bg-green-500/10',
      text: 'text-green-600',
      border: 'border-green-500/20',
      label: 'Active',
    },
    [MatchStatus.REJECTED]: {
      bg: 'bg-red-500/10',
      text: 'text-red-600',
      border: 'border-red-500/20',
      label: 'Rejected',
    },
    [MatchStatus.COMPLETED]: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600',
      border: 'border-blue-500/20',
      label: 'Completed',
    },
  }

  return colors[status] || colors[MatchStatus.PENDING]
}

/**
 * Get user name from profile or fallback
 * IMPORTANT: Never fall back to profession as a name
 */
export function getMatchedUserName(profile: Profile | undefined): string {
  if (!profile) return 'Anonymous User'
  if (profile.name && profile.name.trim()) return profile.name
  return 'User' // Never use profession as name
}

/**
 * Get location string from profile
 */
export function getLocationString(profile: Profile | undefined): string {
  if (!profile || !profile.location) return 'Location Unknown'
  
  const { city, state, country } = profile.location
  
  if (city && state) {
    return `${city}, ${state}`
  }
  
  if (city) {
    return `${city}, ${country}`
  }
  
  return country || 'Location Unknown'
}

/**
 * Get profession from profile
 */
export function getProfession(profile: Profile | undefined): string {
  if (!profile || !profile.profession) return 'Professional'
  return profile.profession.title || 'Professional'
}

/**
 * Get age from profile
 */
export function getAge(profile: Profile | undefined): number | null {
  if (!profile || !profile.age) return null
  return profile.age
}

/**
 * Get intent/goal from profile
 */
export function getIntent(profile: Profile | undefined): string {
  if (!profile || !profile.goals) return 'Connection'
  return profile.goals.relationship || 'Connection'
}

/**
 * Get bio/summary from profile
 */
export function getBio(profile: Profile | undefined): string {
  if (!profile) return 'No bio available'

  // Use the real bio when present
  if (profile.bio && profile.bio.trim()) return profile.bio

  // Otherwise compose a short description from real profile fields
  const interests = profile.interests?.slice(0, 3).join(', ')
  const profession = profile.profession?.title

  if (profession && interests) return `${profession} interested in ${interests}.`
  if (profession) return `${profession}.`
  if (interests) return `Interested in ${interests}.`

  return 'No bio available'
}

/**
 * Get shared interests between user and match
 */
export function getSharedInterests(
  userProfile: Profile | undefined,
  matchProfile: Profile | undefined
): string[] {
  if (!userProfile || !matchProfile) return []
  
  const userInterests = userProfile.interests || []
  const matchInterests = matchProfile.interests || []
  
  return userInterests.filter(interest => 
    matchInterests.includes(interest)
  )
}

/**
 * Get shared values between user and match
 */
export function getSharedValues(
  userProfile: Profile | undefined,
  matchProfile: Profile | undefined
): string[] {
  if (!userProfile || !matchProfile) return []
  
  const userValues = userProfile.values || []
  const matchValues = matchProfile.values || []
  
  return userValues.filter(value => 
    matchValues.includes(value)
  )
}

/**
 * Get shared goals between user and match
 */
export function getSharedGoals(
  userProfile: Profile | undefined,
  matchProfile: Profile | undefined
): string[] {
  if (!userProfile || !matchProfile) return []
  
  const sharedGoals: string[] = []
  
  // Check relationship goals
  if (userProfile.goals?.relationship === matchProfile.goals?.relationship) {
    sharedGoals.push(userProfile.goals.relationship)
  }
  
  // Check personal goals
  const userPersonalGoals = userProfile.goals?.personal || []
  const matchPersonalGoals = matchProfile.goals?.personal || []
  
  const sharedPersonalGoals = userPersonalGoals.filter(goal =>
    matchPersonalGoals.includes(goal)
  )
  
  sharedGoals.push(...sharedPersonalGoals)
  
  return sharedGoals
}

/**
 * Format compatibility percentage
 */
export function formatCompatibility(score: number): string {
  return `${Math.round(score)}%`
}

/**
 * Format confidence percentage
 */
export function formatConfidence(score: number): string {
  return `${Math.round(score)}%`
}

/**
 * Get compatibility color class
 */
export function getCompatibilityColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-orange-600'
}

/**
 * Get compatibility gradient
 */
export function getCompatibilityGradient(score: number): string {
  if (score >= 90) return 'from-green-500 to-emerald-500'
  if (score >= 80) return 'from-blue-500 to-cyan-500'
  if (score >= 70) return 'from-yellow-500 to-orange-500'
  return 'from-orange-500 to-red-500'
}

/**
 * Generate AI summary from match data
 */
export function getAISummary(match: Match): string {
  if (match.summary) return match.summary
  
  // Fallback summary
  return `Your Digital Twin has identified strong compatibility based on shared values and interests. This match shows potential for meaningful connection.`
}

/**
 * Get reasons for match from strengths
 */
export function getMatchReasons(match: Match): string[] {
  if (match.strengths && match.strengths.length > 0) {
    return match.strengths
  }
  
  // Fallback reasons
  return [
    'Compatible personality traits',
    'Shared values and goals',
    'Similar communication styles',
    'Complementary interests',
  ]
}

/**
 * Calculate recommendation statistics
 */
export function calculateRecommendationStats(recommendations: MatchRecommendation[]) {
  if (recommendations.length === 0) {
    return {
      totalRecommendations: 0,
      avgCompatibility: 0,
      lastUpdate: 'Never',
      recommendationsToday: 0,
      highCompatibilityCount: 0,
    }
  }

  const total = recommendations.length
  const avgCompat = recommendations.reduce((sum, r) => sum + r.compatibilityScore, 0) / total
  
  // Count high compatibility (>= 85)
  const highCompat = recommendations.filter(r => r.compatibilityScore >= 85).length
  
  // Find most recent recommendation
  const sortedByDate = [...recommendations].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const mostRecent = sortedByDate[0]
  const lastUpdate = mostRecent ? formatRelativeTime(mostRecent.createdAt) : 'Never'
  
  // Count recommendations from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const recommendationsToday = recommendations.filter(r => {
    const recDate = new Date(r.createdAt)
    recDate.setHours(0, 0, 0, 0)
    return recDate.getTime() === today.getTime()
  }).length

  return {
    totalRecommendations: total,
    avgCompatibility: Math.round(avgCompat),
    lastUpdate,
    recommendationsToday,
    highCompatibilityCount: highCompat,
  }
}

/**
 * Sort recommendations by different criteria
 */
export function sortRecommendations(
  recommendations: MatchRecommendation[],
  sortBy: string
): MatchRecommendation[] {
  const sorted = [...recommendations]
  
  switch (sortBy) {
    case 'compatibility':
      return sorted.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    
    case 'confidence':
      return sorted.sort((a, b) => b.confidenceScore - a.confidenceScore)
    
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    
    default:
      return sorted
  }
}

/**
 * Filter recommendations by intent/goal
 */
export function filterByIntent(
  recommendations: MatchRecommendation[],
  intent: string | null
): MatchRecommendation[] {
  if (!intent) return recommendations
  
  return recommendations.filter(rec => {
    const matchIntent = getIntent(rec.matchedProfile)
    return matchIntent === intent
  })
}

/**
 * Search recommendations by name/profession
 */
export function searchRecommendations(
  recommendations: MatchRecommendation[],
  query: string
): MatchRecommendation[] {
  if (!query) return recommendations
  
  const lowerQuery = query.toLowerCase()
  
  return recommendations.filter(rec => {
    const name = getMatchedUserName(rec.matchedProfile).toLowerCase()
    const profession = getProfession(rec.matchedProfile).toLowerCase()
    const location = getLocationString(rec.matchedProfile).toLowerCase()
    
    return (
      name.includes(lowerQuery) ||
      profession.includes(lowerQuery) ||
      location.includes(lowerQuery)
    )
  })
}

/**
 * Get initials from name for avatar fallback
 */
export function getInitials(profile: Profile | undefined): string {
  if (!profile) return 'U'

  const name = (profile.name && profile.name.trim()) || profile.profession?.title || 'User'
  const parts = name.trim().split(/\s+/)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return name[0]?.toUpperCase() || 'U'
}
