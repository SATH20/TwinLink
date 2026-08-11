/**
 * API Response Types
 * Mirrors backend entity structures
 */

export enum TwinStatus {
  AWAKE = 'AWAKE',
  ASLEEP = 'ASLEEP',
  EXPLORING = 'EXPLORING',
  CONVERSING = 'CONVERSING',
  LEARNING = 'LEARNING',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export interface User {
  id: string
  email: string
  name: string
  clerkId: string
  createdAt: string
  updatedAt: string
}

export interface TwinMemory {
  conversations: string[]
  matchHistory: string[]
  insights: string[]
  preferences: Record<string, any>
}

export interface Twin {
  id: string
  userId: string
  systemPrompt: string
  memory: TwinMemory
  status: TwinStatus
  nextWake: string
  lastWake: string
  version: number
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  userId: string
  name?: string
  avatar?: string
  bio?: string
  age: number
  gender: Gender
  location: {
    city: string
    state?: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  personality: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  values: string[]
  interests: string[]
  communicationStyle: string
  goals: {
    relationship: string
    personal: string[]
    timeline?: string
  }
  preferences: {
    ageRange: { min: number; max: number }
    genderPreference: Gender[]
    maxDistance?: number
    dealBreakers: string[]
  }
  dealBreakers: string[]
  lifestyle: {
    schedule: string
    socialLevel: string
    exercise: string
    diet?: string
    smoking?: string
    drinking?: string
  }
  languages: string[]
  profession: {
    title: string
    industry?: string
    company?: string
  }
  completenessScore: number
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  user: User
  profile: Profile | null
  twin: Twin | null
}

/**
 * Match Status Enum
 */
export enum MatchStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

/**
 * Match Recommendation Interface
 */
export interface Match {
  id: string
  userA: string
  userB: string
  twinA: string
  twinB: string
  compatibilityScore: number
  confidenceScore: number
  status: MatchStatus
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendation: string
  conversationId?: string
  createdAt: string
  updatedAt: string
}

/**
 * Extended Match with User Profile Info
 */
export interface MatchRecommendation extends Match {
  matchedUser?: User
  matchedProfile?: Profile
  matchedTwin?: Twin
}

/**
 * Connection Status Enum
 */
export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

/**
 * Connection Interface
 */
export interface Connection {
  id: string
  currentUserId: string
  targetUserId: string
  conversationId: string
  compatibilityScore: number
  status: ConnectionStatus
  createdAt: string
  updatedAt: string
}

/**
 * Extended Connection with User Profile Info
 */
export interface ConnectionWithProfile extends Connection {
  targetUser?: User
  targetProfile?: Profile
  currentUser?: User
  currentProfile?: Profile
}
