export interface CompatibilityResult {
  compatibilityScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'STRONG_MATCH' | 'GOOD_MATCH' | 'MODERATE_MATCH' | 'WEAK_MATCH' | 'NO_MATCH';
  summary: string;
  detailedAnalysis: {
    emotional: number;
    intellectual: number;
    lifestyle: number;
    values: number;
    communication: number;
  };
}
