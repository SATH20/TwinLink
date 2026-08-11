/**
 * Type definitions for Twin Conversations
 */

export interface ConversationMessage {
  role: 'twin_a' | 'twin_b'
  content: string
  timestamp: string
}

export type CompatibilityRecommendation =
  | 'STRONG_MATCH'
  | 'GOOD_MATCH'
  | 'MODERATE_MATCH'
  | 'WEAK_MATCH'
  | 'NO_MATCH'
  | ''

export interface CompatibilityDetailedAnalysis {
  emotional: number
  intellectual: number
  lifestyle: number
  values: number
  communication: number
}

export interface Conversation {
  id: string
  twinA: string
  twinB: string
  userA: string
  userB: string
  messages: ConversationMessage[]
  summary: string
  topicsDiscussed: string[]
  emotionalTone: string
  compatibilityScore: number
  confidenceScore: number
  strengths: string[]
  weaknesses: string[]
  recommendation: CompatibilityRecommendation
  detailedAnalysis: CompatibilityDetailedAnalysis | null
  reasoningIterations: number
  analysisComplete: boolean
  matchId: string | null
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export interface ConversationHistory {
  id: string
  targetUserName: string
  compatibilityScore: number
  status: string
  createdAt: string
}
