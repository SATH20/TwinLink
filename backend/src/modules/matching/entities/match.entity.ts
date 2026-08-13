import { MatchStatus } from '../enums/match-status.enum';

/**
 * Represents a match between two users/twins in the system.
 */
export class Match {
  id: string;
  userA: string;
  userB: string;
  twinA: string;
  twinB: string;
  compatibilityScore: number;
  confidenceScore: number;
  status: MatchStatus;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
}
