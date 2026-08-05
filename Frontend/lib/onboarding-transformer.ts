/**
 * Onboarding Data Transformer
 * 
 * Transforms the frontend's UI-friendly onboarding data into the
 * backend's structured UpdateProfileDto format.
 * 
 * Frontend collects: string arrays, display labels, free-text
 * Backend expects: enums, Big Five numbers, nested objects
 */

// ============================================================
// Frontend Data Shape (as collected by onboarding UI)
// ============================================================

export interface OnboardingData {
  name: string
  age: string
  gender: string
  location: string
  languages: string[]
  profession: string
  personality: string[]
  interests: string[]
  lifestyle: string[]
  communicationStyle: string[]
  goals: string[]
  relationshipIntent: string[]
  dealBreakers: string[]
}

// ============================================================
// Backend DTO Shape (as expected by PUT /v1/profiles/me)
// ============================================================

interface LocationDto {
  city: string
  state?: string
  country: string
}

interface PersonalityDto {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

interface GoalsDto {
  relationship: string
  personal: string[]
  timeline?: string
}

interface PreferencesDto {
  ageRange: { min: number; max: number }
  genderPreference: string[]
  maxDistance?: number
  dealBreakers: string[]
}

interface LifestyleDto {
  schedule: string
  socialLevel: string
  exercise: string
  diet?: string
  smoking?: string
  drinking?: string
}

interface ProfessionDto {
  title: string
  industry?: string
  company?: string
}

export interface UpdateProfilePayload {
  age?: number
  gender?: string
  location?: LocationDto
  personality?: PersonalityDto
  values?: string[]
  interests?: string[]
  communicationStyle?: string
  goals?: GoalsDto
  preferences?: PreferencesDto
  dealBreakers?: string[]
  lifestyle?: LifestyleDto
  languages?: string[]
  profession?: ProfessionDto
}

// ============================================================
// Gender Mapping
// ============================================================

const GENDER_MAP: Record<string, string> = {
  "Male": "MALE",
  "Female": "FEMALE",
  "Non-binary": "NON_BINARY",
  "Other": "OTHER",
}

// ============================================================
// Personality Trait → Big Five Score Mapping
// 
// Each UI trait contributes to one or more Big Five dimensions.
// Scores are averaged across selected traits.
// ============================================================

interface BigFiveContribution {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

const TRAIT_TO_BIG_FIVE: Record<string, BigFiveContribution> = {
  "Introvert":    { openness: 50, conscientiousness: 60, extraversion: 20, agreeableness: 60, neuroticism: 45 },
  "Extrovert":    { openness: 65, conscientiousness: 50, extraversion: 90, agreeableness: 65, neuroticism: 30 },
  "Ambivert":     { openness: 60, conscientiousness: 55, extraversion: 55, agreeableness: 65, neuroticism: 35 },
  "Calm":         { openness: 55, conscientiousness: 65, extraversion: 45, agreeableness: 70, neuroticism: 15 },
  "Funny":        { openness: 70, conscientiousness: 45, extraversion: 75, agreeableness: 75, neuroticism: 30 },
  "Creative":     { openness: 90, conscientiousness: 45, extraversion: 55, agreeableness: 60, neuroticism: 40 },
  "Logical":      { openness: 60, conscientiousness: 85, extraversion: 40, agreeableness: 50, neuroticism: 25 },
  "Empathetic":   { openness: 70, conscientiousness: 55, extraversion: 55, agreeableness: 90, neuroticism: 45 },
  "Confident":    { openness: 65, conscientiousness: 70, extraversion: 80, agreeableness: 55, neuroticism: 15 },
  "Curious":      { openness: 90, conscientiousness: 50, extraversion: 60, agreeableness: 65, neuroticism: 30 },
}

function mapPersonalityToBlgFive(traits: string[]): PersonalityDto {
  if (traits.length === 0) {
    // Default balanced personality
    return { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 }
  }

  const totals = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 }
  let count = 0

  for (const trait of traits) {
    const contribution = TRAIT_TO_BIG_FIVE[trait]
    if (contribution) {
      totals.openness += contribution.openness
      totals.conscientiousness += contribution.conscientiousness
      totals.extraversion += contribution.extraversion
      totals.agreeableness += contribution.agreeableness
      totals.neuroticism += contribution.neuroticism
      count++
    }
  }

  if (count === 0) {
    return { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 }
  }

  return {
    openness: Math.round(totals.openness / count),
    conscientiousness: Math.round(totals.conscientiousness / count),
    extraversion: Math.round(totals.extraversion / count),
    agreeableness: Math.round(totals.agreeableness / count),
    neuroticism: Math.round(totals.neuroticism / count),
  }
}

// ============================================================
// Location Parsing
// ============================================================

function parseLocation(locationStr: string): LocationDto {
  // Expects format: "City, Country" or "City, State, Country"
  const parts = locationStr.split(",").map(s => s.trim()).filter(Boolean)

  if (parts.length >= 3) {
    return { city: parts[0], state: parts[1], country: parts[2] }
  } else if (parts.length === 2) {
    return { city: parts[0], country: parts[1] }
  } else {
    return { city: parts[0] || locationStr, country: "" }
  }
}

// ============================================================
// Lifestyle Mapping
// ============================================================

function mapLifestyle(lifestyleLabels: string[]): LifestyleDto {
  const result: LifestyleDto = {
    schedule: "flexible",
    socialLevel: "moderate",
    exercise: "moderate",
  }

  for (const label of lifestyleLabels) {
    switch (label) {
      case "Early Bird":
        result.schedule = "early_riser"
        break
      case "Night Owl":
        result.schedule = "night_owl"
        break
      case "Vegetarian":
        result.diet = "vegetarian"
        break
      case "Vegan":
        result.diet = "vegan"
        break
      case "Non-Smoker":
        result.smoking = "never"
        break
      case "Fitness Enthusiast":
        result.exercise = "active"
        break
      case "Homebody":
        result.socialLevel = "low"
        break
      case "Frequent Traveller":
        result.socialLevel = "high"
        break
      case "Foodie":
        result.diet = result.diet || "flexible"
        break
      case "Minimalist":
      case "Maximalist":
      case "Pet Lover":
        // These are personality/preference traits; no direct lifestyle DTO mapping
        break
    }
  }

  return result
}

// ============================================================
// Goals Mapping
// ============================================================

function mapGoals(goals: string[], relationshipIntent: string[]): GoalsDto {
  // Determine relationship type from intent
  let relationship = "open"
  if (relationshipIntent.includes("Dating")) {
    relationship = "long_term"
  } else if (relationshipIntent.includes("Casual")) {
    relationship = "casual"
  } else if (relationshipIntent.includes("Friendship") || relationshipIntent.includes("Professional")) {
    relationship = "open"
  }

  // Map goal labels as personal goals
  const personal = goals.filter(g =>
    !["Long-term Relationship", "Friends"].includes(g)
  )

  return {
    relationship,
    personal: personal.length > 0 ? personal : goals,
    timeline: "flexible",
  }
}

// ============================================================
// Communication Style Mapping
// ============================================================

function mapCommunicationStyle(styles: string[]): string {
  // The backend expects a single string value
  // Map to one of: "direct", "thoughtful", "expressive", "casual"
  if (styles.includes("Direct")) return "direct"
  if (styles.includes("Thoughtful")) return "thoughtful"
  if (styles.includes("Funny") || styles.includes("Talkative")) return "expressive"
  if (styles.includes("Professional")) return "direct"
  if (styles.includes("Listener")) return "thoughtful"
  if (styles.includes("Casual") || styles.includes("Friendly")) return "casual"
  return styles[0]?.toLowerCase() || "casual"
}

// ============================================================
// Main Transform Function
// ============================================================

/**
 * Transforms frontend onboarding data into the backend's UpdateProfileDto format.
 * This is the single source of truth for the data mapping.
 */
export function transformOnboardingData(data: OnboardingData): UpdateProfilePayload {
  const payload: UpdateProfilePayload = {}

  // Age: string → number
  if (data.age) {
    const age = parseInt(data.age, 10)
    if (!isNaN(age) && age >= 18 && age <= 120) {
      payload.age = age
    }
  }

  // Gender: display label → enum
  if (data.gender) {
    payload.gender = GENDER_MAP[data.gender] || "PREFER_NOT_TO_SAY"
  }

  // Location: "City, Country" → LocationDto
  if (data.location) {
    payload.location = parseLocation(data.location)
  }

  // Personality: trait labels → Big Five numeric scores
  if (data.personality.length > 0) {
    payload.personality = mapPersonalityToBlgFive(data.personality)
  }

  // Values: derived from personality traits + goals
  // Use personality traits as the user's expressed values
  const values: string[] = []
  if (data.personality.includes("Empathetic")) values.push("Empathy")
  if (data.personality.includes("Logical")) values.push("Logic")
  if (data.personality.includes("Creative")) values.push("Creativity")
  if (data.personality.includes("Confident")) values.push("Confidence")
  if (data.personality.includes("Curious")) values.push("Curiosity")
  if (data.personality.includes("Calm")) values.push("Inner Peace")
  if (data.goals.includes("Long-term Relationship")) values.push("Commitment")
  if (data.goals.includes("Career Growth")) values.push("Ambition")
  if (data.goals.includes("Mentorship")) values.push("Growth")
  if (data.dealBreakers.includes("Dishonesty")) values.push("Honesty")
  if (data.dealBreakers.includes("Lack of Respect")) values.push("Respect")
  if (values.length > 0) {
    payload.values = values
  }

  // Interests: pass through directly
  if (data.interests.length > 0) {
    payload.interests = data.interests
  }

  // Communication style: multiple labels → single string
  if (data.communicationStyle.length > 0) {
    payload.communicationStyle = mapCommunicationStyle(data.communicationStyle)
  }

  // Goals: labels → GoalsDto
  if (data.goals.length > 0 || data.relationshipIntent.length > 0) {
    payload.goals = mapGoals(data.goals, data.relationshipIntent)
  }

  // Preferences: age range + gender preference + deal breakers
  payload.preferences = {
    ageRange: {
      min: Math.max(18, (payload.age || 25) - 5),
      max: Math.min(120, (payload.age || 25) + 5),
    },
    genderPreference: data.gender === "Male" ? ["FEMALE"] : data.gender === "Female" ? ["MALE"] : ["MALE", "FEMALE", "NON_BINARY"],
    maxDistance: 50,
    dealBreakers: data.dealBreakers.length > 0 ? data.dealBreakers : [],
  }

  // Deal breakers: pass through
  if (data.dealBreakers.length > 0) {
    payload.dealBreakers = data.dealBreakers
  }

  // Lifestyle: labels → LifestyleDto
  if (data.lifestyle.length > 0) {
    payload.lifestyle = mapLifestyle(data.lifestyle)
  }

  // Languages: pass through
  if (data.languages.length > 0) {
    payload.languages = data.languages
  }

  // Profession: string → ProfessionDto
  if (data.profession) {
    payload.profession = { title: data.profession }
  }

  return payload
}

// ============================================================
// Validation
// ============================================================

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates onboarding data before submission.
 * Returns a list of human-readable validation errors.
 */
export function validateOnboardingData(data: OnboardingData): ValidationResult {
  const errors: string[] = []

  if (!data.name.trim()) errors.push("Name is required")
  if (!data.age.trim()) errors.push("Age is required")
  else {
    const age = parseInt(data.age, 10)
    if (isNaN(age) || age < 18 || age > 120) errors.push("Age must be between 18 and 120")
  }
  if (!data.gender) errors.push("Gender is required")
  if (!data.location.trim()) errors.push("Location is required")
  if (!data.profession.trim()) errors.push("Profession is required")
  if (data.personality.length === 0) errors.push("Select at least one personality trait")
  if (data.interests.length === 0) errors.push("Select at least one interest")
  if (data.lifestyle.length === 0) errors.push("Select at least one lifestyle preference")
  if (data.communicationStyle.length === 0) errors.push("Select at least one communication style")
  if (data.goals.length === 0) errors.push("Select at least one goal")
  if (data.relationshipIntent.length === 0) errors.push("Select at least one connection type")

  return {
    isValid: errors.length === 0,
    errors,
  }
}
