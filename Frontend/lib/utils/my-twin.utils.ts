/**
 * My Twin Utility Functions
 * Helpers for transforming backend data to UI-ready format
 */

import { Twin, Profile, TwinStatus } from '../types/api.types'
import { formatRelativeTime } from './dashboard.utils'

/**
 * Get Twin display name from user name
 */
export function getTwinName(userName: string): string {
  if (!userName) return 'Digital Twin'
  const firstName = userName.split(' ')[0]
  return `${firstName}'s Digital Twin`
}

/**
 * Map personality from Big Five to display traits
 */
export function mapPersonalityTraits(personality: Profile['personality']) {
  if (!personality) return []

  const traits = [
    { 
      trait: 'Creative', 
      confidence: Math.round(personality.openness), 
      color: 'text-purple-500',
      key: 'openness'
    },
    { 
      trait: 'Organized', 
      confidence: Math.round(personality.conscientiousness), 
      color: 'text-blue-500',
      key: 'conscientiousness'
    },
    { 
      trait: 'Sociable', 
      confidence: Math.round(personality.extraversion), 
      color: 'text-green-500',
      key: 'extraversion'
    },
    { 
      trait: 'Empathetic', 
      confidence: Math.round(personality.agreeableness), 
      color: 'text-yellow-500',
      key: 'agreeableness'
    },
    { 
      trait: 'Calm', 
      confidence: Math.round(100 - personality.neuroticism), // Invert for display
      color: 'text-teal-500',
      key: 'emotional_stability'
    },
  ]

  return traits.filter(t => t.confidence > 0)
}

/**
 * Map profile values to UI format
 */
export function mapValues(values: string[]) {
  if (!values || values.length === 0) return []

  return values.map((value, index) => ({
    value,
    strength: 90 + (index % 10), // Simulate strength based on order
  }))
}

/**
 * Extract communication style from profile
 */
export function mapCommunicationStyle(communicationStyle: string) {
  if (!communicationStyle) return []

  // Map the communication style to multiple attributes
  const styles: Record<string, { style: string; level: number }[]> = {
    'friendly': [
      { style: 'Friendly', level: 95 },
      { style: 'Warm', level: 90 },
      { style: 'Approachable', level: 88 },
    ],
    'professional': [
      { style: 'Professional', level: 95 },
      { style: 'Formal', level: 88 },
      { style: 'Structured', level: 85 },
    ],
    'casual': [
      { style: 'Casual', level: 95 },
      { style: 'Relaxed', level: 90 },
      { style: 'Easy-going', level: 87 },
    ],
    'thoughtful': [
      { style: 'Thoughtful', level: 95 },
      { style: 'Reflective', level: 90 },
      { style: 'Deep', level: 88 },
    ],
  }

  const lowerStyle = communicationStyle.toLowerCase()
  return styles[lowerStyle] || [
    { style: communicationStyle, level: 90 },
  ]
}

/**
 * Map goals from profile
 */
export function mapGoals(goals: Profile['goals']) {
  if (!goals) return []

  const goalsList = []
  
  if (goals.relationship) {
    goalsList.push(goals.relationship)
  }
  
  if (goals.personal && goals.personal.length > 0) {
    goalsList.push(...goals.personal)
  }

  return goalsList
}

/**
 * Generate AI insights from twin memory
 */
export function generateInsights(twin: Twin, profile: Profile | null): string[] {
  if (!twin) return []

  const insights: string[] = []

  // Insight from conversation count
  const conversationCount = twin.memory?.conversations?.length || 0
  if (conversationCount > 10) {
    insights.push('You communicate best with thoughtful people.')
  } else if (conversationCount > 5) {
    insights.push('Your Twin is learning your communication preferences.')
  }

  // Insight from profile communication style
  if (profile?.communicationStyle) {
    insights.push(`You prefer ${profile.communicationStyle.toLowerCase()} conversations.`)
  }

  // Insight from values
  if (profile?.values && profile.values.length > 0) {
    insights.push(`You value ${profile.values[0].toLowerCase()} above all.`)
  }

  // Insight from goals
  if (profile?.goals?.relationship) {
    insights.push(`Looking for ${profile.goals.relationship.toLowerCase()}.`)
  }

  return insights.slice(0, 4) // Limit to 4 insights
}

/**
 * Generate memory items from twin memory
 */
export function generateMemoryItems(twin: Twin, profile: Profile | null) {
  if (!twin) return []

  const memories: { memory: string; category: string }[] = []

  // From communication style
  if (profile?.communicationStyle) {
    memories.push({
      memory: `Prefers ${profile.communicationStyle} communication`,
      category: 'Communication',
    })
  }

  // From interests
  if (profile?.interests && profile.interests.length > 0) {
    profile.interests.slice(0, 2).forEach(interest => {
      memories.push({
        memory: `Enjoys ${interest}`,
        category: 'Interests',
      })
    })
  }

  // From values
  if (profile?.values && profile.values.length > 0) {
    memories.push({
      memory: `Values ${profile.values[0].toLowerCase()}`,
      category: 'Values',
    })
  }

  // From goals
  if (profile?.goals?.relationship) {
    memories.push({
      memory: `Seeking ${profile.goals.relationship.toLowerCase()}`,
      category: 'Goals',
    })
  }

  // From twin insights
  if (twin.memory?.insights && twin.memory.insights.length > 0) {
    twin.memory.insights.slice(0, 2).forEach(insight => {
      memories.push({
        memory: insight,
        category: 'AI Insight',
      })
    })
  }

  return memories.slice(0, 6) // Limit to 6 memories
}

/**
 * Calculate network statistics from twin memory
 */
export function calculateNetworkStats(twin: Twin) {
  if (!twin || !twin.memory) {
    return {
      twinsVisited: 0,
      aiConversations: 0,
      compatibilityChecks: 0,
      matchesFound: 0,
    }
  }

  const conversations = twin.memory.conversations?.length || 0
  const matches = twin.memory.matchHistory?.length || 0
  const insights = twin.memory.insights?.length || 0

  return {
    twinsVisited: matches * 15 + conversations * 10, // Estimated
    aiConversations: conversations,
    compatibilityChecks: conversations + matches,
    matchesFound: matches,
  }
}

/**
 * Generate learning timeline from twin data
 */
export function generateLearningTimeline(twin: Twin, profile: Profile | null) {
  if (!twin) return []

  const timeline = []

  // Last wake
  if (twin.lastWake) {
    timeline.push({
      event: 'Updated twin status and preferences',
      time: formatRelativeTime(twin.lastWake),
      type: 'preferences',
    })
  }

  // From twin version updates
  if (twin.version > 1) {
    timeline.push({
      event: `Twin upgraded to version ${twin.version}`,
      time: formatRelativeTime(twin.updatedAt),
      type: 'personality',
    })
  }

  // From conversation count
  const conversationCount = twin.memory?.conversations?.length || 0
  if (conversationCount > 0) {
    timeline.push({
      event: 'Learned communication patterns from conversations',
      time: formatRelativeTime(twin.updatedAt),
      type: 'communication',
    })
  }

  // From insights
  if (twin.memory?.insights && twin.memory.insights.length > 0) {
    timeline.push({
      event: 'Discovered new compatibility patterns',
      time: formatRelativeTime(twin.updatedAt),
      type: 'interests',
    })
  }

  return timeline.slice(0, 4) // Limit to 4 items
}

/**
 * Get current mission text based on twin status
 */
export function getCurrentMissionText(twin: Twin): string {
  if (!twin) return 'Initializing mission...'

  const statusMissions: Record<TwinStatus, string> = {
    [TwinStatus.AWAKE]: 'Ready to explore and find compatible matches',
    [TwinStatus.ASLEEP]: 'Resting and processing recent interactions',
    [TwinStatus.EXPLORING]: 'Searching for highly compatible people',
    [TwinStatus.CONVERSING]: 'Engaging in deep conversations with other twins',
    [TwinStatus.LEARNING]: 'Learning from recent matches and conversations',
  }

  return statusMissions[twin.status] || 'Processing...'
}

/**
 * Calculate mission progress
 */
export function calculateMissionProgress(twin: Twin): number {
  if (!twin || !twin.memory) return 0

  const conversations = twin.memory.conversations?.length || 0
  const matches = twin.memory.matchHistory?.length || 0
  const insights = twin.memory.insights?.length || 0

  // Calculate progress based on activity
  const totalActivity = conversations + matches + insights
  const maxActivity = 50 // Target for 100% progress

  return Math.min(100, Math.round((totalActivity / maxActivity) * 100))
}

/**
 * Get current mission stage
 */
export function getCurrentMissionStage(twin: Twin): string {
  if (!twin) return 'Searching'

  const stageMap: Record<TwinStatus, string> = {
    [TwinStatus.AWAKE]: 'Searching',
    [TwinStatus.ASLEEP]: 'Resting',
    [TwinStatus.EXPLORING]: 'Searching',
    [TwinStatus.CONVERSING]: 'Talking',
    [TwinStatus.LEARNING]: 'Evaluating',
  }

  return stageMap[twin.status] || 'Searching'
}
