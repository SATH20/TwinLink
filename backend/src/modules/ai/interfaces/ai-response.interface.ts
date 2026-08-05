export interface GenerateTwinResponse {
  systemPrompt: string;
  personalitySummary: string;
  communicationGuidelines: string[];
  reasoningFramework: string;
}

export interface ConversationMessage {
  role: 'twin_a' | 'twin_b';
  content: string;
  timestamp: string;
}

export interface ConversationResponse {
  messages: ConversationMessage[];
  summary: string;
  topicsDiscussed: string[];
  emotionalTone: string;
}

export interface CompatibilityDetailedAnalysis {
  emotional: number;
  intellectual: number;
  lifestyle: number;
  values: number;
  communication: number;
}

export interface CompatibilityResponse {
  compatibilityScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'STRONG_MATCH' | 'GOOD_MATCH' | 'MODERATE_MATCH' | 'WEAK_MATCH' | 'NO_MATCH';
  summary: string;
  detailedAnalysis: CompatibilityDetailedAnalysis;
}
