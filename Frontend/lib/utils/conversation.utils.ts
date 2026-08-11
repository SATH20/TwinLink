/**
 * Utilities for the Twin Conversation feature.
 * Pure functions that map backend data to display-ready values so that every
 * card on the page derives from a single source of truth (the Conversation).
 */

import type {
  Conversation,
  CompatibilityRecommendation,
} from '@/lib/types/conversation'
import type { ProfileResponse } from '@/lib/api-client'

/**
 * Big Five personality trait scores (0-100) as stored on a profile.
 */
interface BigFivePersonality {
  openness?: number
  conscientiousness?: number
  extraversion?: number
  agreeableness?: number
  neuroticism?: number
}

/**
 * Derive human-readable personality trait labels from a profile's Big Five
 * scores. Only traits that are strongly expressed (>= 60) are surfaced.
 * Returns an empty array when no personality data is available.
 */
export function derivePersonalityTraits(profile: ProfileResponse | null): string[] {
  const p = profile?.personality as BigFivePersonality | undefined
  if (!p || typeof p !== 'object') return []

  const labels: string[] = []
  if (typeof p.openness === 'number' && p.openness >= 60) labels.push('Open-minded')
  if (typeof p.conscientiousness === 'number' && p.conscientiousness >= 60) labels.push('Conscientious')
  if (typeof p.extraversion === 'number' && p.extraversion >= 60) labels.push('Extraverted')
  else if (typeof p.extraversion === 'number' && p.extraversion < 40) labels.push('Introspective')
  if (typeof p.agreeableness === 'number' && p.agreeableness >= 60) labels.push('Agreeable')
  if (typeof p.neuroticism === 'number' && p.neuroticism < 40) labels.push('Emotionally stable')

  return labels
}

/**
 * Safely read the interests array from a profile.
 */
export function getProfileInterests(profile: ProfileResponse | null): string[] {
  return Array.isArray(profile?.interests) ? (profile!.interests as string[]) : []
}

/**
 * Safely read the values array from a profile.
 */
export function getProfileValues(profile: ProfileResponse | null): string[] {
  return Array.isArray(profile?.values) ? (profile!.values as string[]) : []
}

/**
 * Compute the elapsed conversation duration from timestamps.
 * Returns "0s" when timestamps are missing or invalid (never "NaN").
 */
export function calculateDuration(createdAt?: string, updatedAt?: string): string {
  if (!createdAt || !updatedAt) return '0s'

  const start = new Date(createdAt).getTime()
  const end = new Date(updatedAt).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) return '0s'

  const diffSeconds = Math.floor((end - start) / 1000)
  if (diffSeconds <= 0) return '0s'

  const minutes = Math.floor(diffSeconds / 60)
  const seconds = diffSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

/**
 * Map the backend recommendation enum to a short action label + color used by
 * the compatibility report card. Derived purely from backend data.
 */
export function getRecommendationDisplay(
  recommendation: CompatibilityRecommendation,
  score: number,
): { label: string; color: string; nextStep: string } {
  switch (recommendation) {
    case 'STRONG_MATCH':
      return {
        label: 'Proceed',
        color: '#10b981',
        nextStep: 'Strong compatibility detected. We recommend accepting the introduction.',
      }
    case 'GOOD_MATCH':
      return {
        label: 'Proceed',
        color: '#10b981',
        nextStep: 'A promising match. Accepting the introduction is recommended.',
      }
    case 'MODERATE_MATCH':
      return {
        label: 'Consider',
        color: '#f59e0b',
        nextStep: 'This match shows potential. Review the analysis before connecting.',
      }
    case 'WEAK_MATCH':
      return {
        label: 'Review',
        color: '#ef4444',
        nextStep: 'Limited compatibility. Review the conversation carefully before proceeding.',
      }
    case 'NO_MATCH':
      return {
        label: 'Review',
        color: '#ef4444',
        nextStep: 'The analysis suggests low compatibility for this pairing.',
      }
    default:
      // No recommendation yet — fall back to score-based guidance without
      // inventing data the backend has not produced.
      if (score >= 70) {
        return { label: 'Proceed', color: '#10b981', nextStep: 'Compatibility clears the match threshold.' }
      }
      return { label: 'Analyzing', color: '#6b7280', nextStep: 'Compatibility analysis in progress.' }
  }
}

/**
 * Build the map of reasoning dimensions from the backend detailedAnalysis.
 * Returns an empty array when the analysis is not yet available.
 */
export function getReasoningDimensions(
  conversation: Conversation | null,
): { name: string; score: number; color: string }[] {
  const d = conversation?.detailedAnalysis
  if (!d) return []

  return [
    { name: 'Emotional', score: Math.round(d.emotional), color: '#156d95' },
    { name: 'Intellectual', score: Math.round(d.intellectual), color: '#8b5cf6' },
    { name: 'Lifestyle', score: Math.round(d.lifestyle), color: '#0ea5e9' },
    { name: 'Values', score: Math.round(d.values), color: '#10b981' },
    { name: 'Communication', score: Math.round(d.communication), color: '#f59e0b' },
  ]
}
