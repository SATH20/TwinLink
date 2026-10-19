// ============================================================
// TwinLink API Types — mirrors backend entities from Firestore
// ============================================================

// ── Enums ────────────────────────────────────────────────────

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NON_BINARY = "NON_BINARY",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum TwinStatus {
  CREATED = "CREATED",
  ACTIVE = "ACTIVE",
  SEARCHING = "SEARCHING",
  TALKING = "TALKING",
  EVALUATING = "EVALUATING",
  MATCH_FOUND = "MATCH_FOUND",
  SLEEPING = "SLEEPING",
}

export enum MatchStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum ConversationStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum NotificationType {
  MATCH_FOUND = "MATCH_FOUND",
  CONVERSATION_COMPLETE = "CONVERSATION_COMPLETE",
  TWIN_UPDATED = "TWIN_UPDATED",
}

export enum MatchRecommendation {
  STRONG_MATCH = "STRONG_MATCH",
  GOOD_MATCH = "GOOD_MATCH",
  MODERATE_MATCH = "MODERATE_MATCH",
  WEAK_MATCH = "WEAK_MATCH",
  NO_MATCH = "NO_MATCH",
}

// ── User ─────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  clerkId: string
  createdAt: string
  updatedAt: string
}

// ── Profile ──────────────────────────────────────────────────

export interface ProfileLocation {
  city: string
  state?: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface PersonalityTraits {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface ProfileGoals {
  relationship: string
  personal: string[]
  timeline?: string
}

export interface ProfilePreferences {
  ageRange?: { min: number; max: number }
  genderPreference?: Gender[]
  maxDistance?: number
  dealBreakers: string[]
}

export interface ProfileLifestyle {
  schedule: string
  socialLevel: string
  exercise: string
  diet?: string
  smoking?: string
  drinking?: string
}

export interface ProfileProfession {
  title: string
  industry?: string
  company?: string
}

export interface Profile {
  id: string
  userId: string
  age: number
  gender: Gender
  location: ProfileLocation
  personality: PersonalityTraits
  values: string[]
  interests: string[]
  communicationStyle: string
  goals: ProfileGoals
  preferences: ProfilePreferences
  dealBreakers: string[]
  lifestyle: ProfileLifestyle
  languages: string[]
  profession: ProfileProfession
  completenessScore: number
  createdAt: string
  updatedAt: string
}

// ── Twin ─────────────────────────────────────────────────────

export interface TwinMemory {
  conversations: string[]
  matchHistory: string[]
  insights: string[]
  preferences: Record<string, unknown>
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

// ── Match ────────────────────────────────────────────────────

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

// ── Conversation ─────────────────────────────────────────────

export interface ConversationMessage {
  role: "twin_a" | "twin_b"
  content: string
  timestamp: string
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
  status: ConversationStatus
  createdAt: string
  updatedAt: string
}

// ── Compatibility ────────────────────────────────────────────

export interface DetailedAnalysis {
  emotional: number
  intellectual: number
  lifestyle: number
  values: number
  communication: number
}

export interface CompatibilityResult {
  compatibilityScore: number
  confidenceScore: number
  strengths: string[]
  weaknesses: string[]
  recommendation: MatchRecommendation
  summary: string
  detailedAnalysis: DetailedAnalysis
}

// ── Notification ─────────────────────────────────────────────

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  read: boolean
  createdAt: string
}

// ── API Response Wrappers ────────────────────────────────────

export interface LoginResponse {
  userId: string
  email: string
  isNewUser: boolean
  message: string
}

export interface MatchingStartResponse {
  success: boolean
  candidatesFound: number
  data: ScoredCandidate[]
}

export interface ScoredCandidate {
  userId: string
  profileId: string
  compositeScore: number
  scores: Record<string, number>
}

export interface TwinGenerationResponse {
  systemPrompt: string
  personalitySummary: string
  communicationGuidelines: string[]
  reasoningFramework: string
}
