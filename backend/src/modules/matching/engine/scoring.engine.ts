import { Injectable } from '@nestjs/common';

export interface ScoredCandidate {
  profile: any;
  totalScore: number;
  breakdown: {
    interests: number;
    values: number;
    personality: number;
    lifestyle: number;
    communication: number;
    goals: number;
  };
}

/**
 * Engine for scoring candidate compatibility based on multiple dimensions.
 */
@Injectable()
export class ScoringEngine {
  /**
   * Scores a candidate against a user's profile.
   * @param userProfile The user seeking a match
   * @param candidateProfile The candidate to score
   * @returns Detailed score breakdown and total score
   */
  scoreCandidate(userProfile: any, candidateProfile: any): ScoredCandidate {
    const interestsScore = this.scoreInterests(userProfile, candidateProfile);
    const valuesScore = this.scoreValues(userProfile, candidateProfile);
    const personalityScore = this.scorePersonality(userProfile, candidateProfile);
    const lifestyleScore = this.scoreLifestyle(userProfile, candidateProfile);
    const communicationScore = this.scoreCommunication(userProfile, candidateProfile);
    const goalsScore = this.scoreGoals(userProfile, candidateProfile);

    // Weighted total (0-100)
    const totalScore = 
      (interestsScore * 0.25) +
      (valuesScore * 0.25) +
      (personalityScore * 0.20) +
      (lifestyleScore * 0.15) +
      (communicationScore * 0.10) +
      (goalsScore * 0.05);

    return {
      profile: candidateProfile,
      totalScore: Math.round(totalScore),
      breakdown: {
        interests: interestsScore,
        values: valuesScore,
        personality: personalityScore,
        lifestyle: lifestyleScore,
        communication: communicationScore,
        goals: goalsScore,
      },
    };
  }

  /**
   * Ranks candidates based on total score.
   * @param scored The array of scored candidates
   * @param topN The number of top candidates to return
   * @returns Sorted and truncated list of scored candidates
   */
  rankCandidates(scored: ScoredCandidate[], topN: number): ScoredCandidate[] {
    return [...scored]
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, topN);
  }

  private scoreInterests(user: any, candidate: any): number {
    return this.jaccardSimilarity(user?.interests || [], candidate?.interests || []) * 100;
  }

  private scoreValues(user: any, candidate: any): number {
    return this.jaccardSimilarity(user?.values || [], candidate?.values || []) * 100;
  }

  private scorePersonality(user: any, candidate: any): number {
    // Big Five traits are stored as named 0-1 float fields on the profile
    // (openness, conscientiousness, extraversion, agreeableness, neuroticism),
    // not as a `traits` array.
    const traitKeys = [
      'openness',
      'conscientiousness',
      'extraversion',
      'agreeableness',
      'neuroticism',
    ];

    const uPers = user?.personality || {};
    const cPers = candidate?.personality || {};

    let totalDiff = 0;
    for (const key of traitKeys) {
      const uVal = typeof uPers[key] === 'number' ? uPers[key] : 0.5;
      const cVal = typeof cPers[key] === 'number' ? cPers[key] : 0.5;
      totalDiff += Math.abs(uVal - cVal);
    }

    // Values are 0-1, so the max possible summed difference across 5 traits is 5.
    const compatibility = 1 - (totalDiff / 5);
    return Math.max(0, compatibility * 100);
  }

  private scoreLifestyle(user: any, candidate: any): number {
    // Compare basic lifestyle fields
    let score = 100;
    if (user?.lifestyle?.schedule !== candidate?.lifestyle?.schedule) score -= 25;
    if (user?.lifestyle?.socialLevel !== candidate?.lifestyle?.socialLevel) score -= 25;
    if (user?.lifestyle?.exercise !== candidate?.lifestyle?.exercise) score -= 25;
    return Math.max(0, score);
  }

  private scoreCommunication(user: any, candidate: any): number {
    const style1 = user?.communicationStyle || 'standard';
    const style2 = candidate?.communicationStyle || 'standard';

    if (style1 === style2) return 100;
    return 40; // Default difference
  }

  private scoreGoals(user: any, candidate: any): number {
    return this.jaccardSimilarity(user?.goals?.personal || [], candidate?.goals?.personal || []) * 100;
  }

  private jaccardSimilarity(arr1: any[], arr2: any[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }
}
