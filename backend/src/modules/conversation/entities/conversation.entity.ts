export interface ConversationMessage {
  role: 'twin_a' | 'twin_b';
  content: string;
  timestamp: string;
}

export interface ConversationDetailedAnalysis {
  emotional: number;
  intellectual: number;
  lifestyle: number;
  values: number;
  communication: number;
}

export type CompatibilityRecommendation =
  | 'STRONG_MATCH'
  | 'GOOD_MATCH'
  | 'MODERATE_MATCH'
  | 'WEAK_MATCH'
  | 'NO_MATCH';

export class Conversation {
  id: string;
  twinA: string;
  twinB: string;
  userA: string;
  userB: string;
  messages: ConversationMessage[];
  summary: string;
  topicsDiscussed: string[];
  emotionalTone: string;

  // ── Compatibility analysis (persisted after the async analysis completes) ──
  compatibilityScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: CompatibilityRecommendation | '';
  detailedAnalysis: ConversationDetailedAnalysis | null;

  // Number of reasoning iterations the AI performed. Falls back to the number
  // of messages exchanged when the engine does not report a distinct value.
  reasoningIterations: number;

  // Whether the async compatibility analysis has finished for this conversation.
  analysisComplete: boolean;

  // Set once a high-compatibility match record is created for this pair.
  matchId: string | null;

  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}
