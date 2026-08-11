import { Injectable, NotFoundException, ForbiddenException, BadRequestException, forwardRef, Inject, Logger } from '@nestjs/common';
import { MatchingRepository } from './matching.repository';
import { CandidateFilterEngine } from './engine/candidate-filter.engine';
import { ScoringEngine, ScoredCandidate } from './engine/scoring.engine';
import { Match } from './entities/match.entity';
import { MatchStatus } from './enums/match-status.enum';
import { ProfilesService } from '../profiles/profiles.service';
import { TwinsService } from '../twins/twins.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { TwinStatus } from '../twins/enums/twin-status.enum';

/**
 * Result of a single matching run, including diagnostics that explain WHY the
 * run produced the number of candidates it did. Surfaced to the client so the
 * UI can give meaningful feedback instead of silently showing an empty state.
 */
export interface MatchingRunResult {
  candidates: ScoredCandidate[];
  /** Number of other profiles considered (whole pool, excluding the user). */
  totalCandidates: number;
  /** How many candidates were removed by the hard-constraint filter engine. */
  eliminated: number;
  /** How many surviving candidates were scored. */
  scored: number;
  /** How many Match documents were persisted to Firestore. */
  persisted: number;
  /** Breakdown of which filter eliminated how many candidates. */
  eliminationReasons: Record<string, number>;
}

/**
 * Service for handling matching logic.
 */
@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly matchingRepository: MatchingRepository,
    private readonly filterEngine: CandidateFilterEngine,
    private readonly scoringEngine: ScoringEngine,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
    @Inject(forwardRef(() => TwinsService))
    private readonly twinsService: TwinsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Starts the matching process for a user.
   * @param userId The user ID
   * @param maxCandidates The maximum number of candidates to return
   * @returns The matching run result, including diagnostics
   */
  async startMatching(userId: string, maxCandidates: number = 10): Promise<MatchingRunResult> {
    this.logger.log(`========== MATCHING DEBUG START ==========`);
    this.logger.log(`[STAGE 0] Current userId: ${userId}`);

    // 1. Get user's profile. Fail with an actionable message instead of a bare
    //    404 so the UI can tell the user exactly what to do next.
    let userProfile;
    try {
      userProfile = await this.profilesService.getProfile(userId);
    } catch (err) {
      this.logger.warn(`[STAGE 1] No profile for user ${userId}: ${(err as Error).message}`);
      throw new BadRequestException(
        'Your profile is not set up yet. Please complete onboarding before starting the matching process.',
      );
    }
    this.logger.log(`[STAGE 1] User profile found: ${userProfile.id}`);

    // 2. Get user's twin. Same actionable-error treatment as the profile.
    let twin;
    try {
      twin = await this.twinsService.getTwin(userId);
    } catch (err) {
      this.logger.warn(`[STAGE 2] No twin for user ${userId}: ${(err as Error).message}`);
      throw new BadRequestException(
        'Your Digital Twin has not been created yet. Please finish onboarding to create your Twin, then try again.',
      );
    }
    this.logger.log(`[STAGE 2] User twin ID: ${twin.id}, status: ${twin.status}`);

    // 3. Set twin status to SEARCHING
    await this.twinsService.updateStatus(twin.id, TwinStatus.SEARCHING);
    this.logger.log(`[STAGE 3] Twin status updated to SEARCHING`);

    // 4. Fetch all profiles (exclude current user + any profile missing a userId)
    const allProfiles = await this.profilesService.getAllProfiles();
    this.logger.log(`[STAGE 4] Total profiles in Firestore: ${allProfiles.length}`);

    const candidates = allProfiles.filter(
      (p) =>
        p.userId &&
        p.userId !== userId &&
        // Respect the Privacy setting: users who turned off "include me in
        // recommendations" are excluded from everyone else's candidate pool.
        (p as any).privacy?.includeInMatching !== false,
    );
    const totalCandidates = candidates.length;
    this.logger.log(`[STAGE 5] After excluding current user + opted-out profiles: ${totalCandidates} candidates`);

    // 5. Run through CandidateFilterEngine
    this.logger.log(`[STAGE 6] Running CandidateFilterEngine...`);
    const filteredResults = this.filterEngine.filterCandidates(userProfile, candidates);

    // Log elimination details + build a breakdown to return to the client.
    const eliminated = filteredResults.filter((r: any) => r.eliminatedBy);
    const eliminationReasons: Record<string, number> = {};
    eliminated.forEach((r: any) => {
      const reason = r.eliminatedBy || 'unknown';
      eliminationReasons[reason] = (eliminationReasons[reason] || 0) + 1;
    });
    if (eliminated.length > 0) {
      this.logger.log(`[STAGE 6] ${eliminated.length} candidates ELIMINATED:`);
      Object.entries(eliminationReasons).forEach(([reason, count]) => {
        this.logger.log(`  - ${reason}: ${count} candidates`);
      });
    }

    const validCandidates = filteredResults.filter((r: any) => !r.eliminatedBy).map((r: any) => r.profile);
    this.logger.log(`[STAGE 7] After CandidateFilterEngine: ${validCandidates.length} valid candidates`);

    // 6. Run through ScoringEngine
    this.logger.log(`[STAGE 8] Running ScoringEngine...`);
    const scoredCandidates = validCandidates.map((c: any) => this.scoringEngine.scoreCandidate(userProfile, c));
    this.logger.log(`[STAGE 9] Scored ${scoredCandidates.length} candidates`);

    // 7. Rank and take the top N scored candidates
    const ranked = this.scoringEngine.rankCandidates(scoredCandidates, maxCandidates);
    this.logger.log(`[STAGE 10] Final ranked candidates: ${ranked.length}`);

    // 8. Persist ranked candidates as Match documents so GET /recommendations
    //    (which reads only the `matches` collection) can surface them.
    let persistedCount = 0;
    for (const c of ranked) {
      const candidateUserId = c.profile?.userId;
      if (!candidateUserId) {
        this.logger.warn(`[STAGE 11] Skipping candidate without userId`);
        continue;
      }
      await this.createMatch(
        userId,
        candidateUserId,
        c.totalScore,
        `Auto-generated match (score ${c.totalScore})`,
      );
      persistedCount += 1;
    }
    this.logger.log(`[STAGE 11] Persisted ${persistedCount} matches to Firestore`);

    // Reflect the outcome on the twin so its status is meaningful after a run.
    await this.twinsService.updateStatus(
      twin.id,
      persistedCount > 0 ? TwinStatus.MATCH_FOUND : TwinStatus.ACTIVE,
    );
    this.logger.log(`========== MATCHING DEBUG END ==========`);

    return {
      candidates: ranked,
      totalCandidates,
      eliminated: eliminated.length,
      scored: scoredCandidates.length,
      persisted: persistedCount,
      eliminationReasons,
    };
  }

  /**
   * Gets current recommendations for a user.
   * @param userId The user ID
   * @returns Array of active matches sorted by compatibility score
   */
  async getRecommendations(userId: string): Promise<Match[]> {
    const matches = await this.matchingRepository.findActiveMatches(userId);
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  /**
   * Gets the match history for a user.
   * @param userId The user ID
   * @returns Array of all matches
   */
  async getMatchHistory(userId: string): Promise<Match[]> {
    return this.matchingRepository.findByUserId(userId);
  }

  /**
   * Creates a match record in Firestore.
   * @param userA First user ID
   * @param userB Second user ID
   * @param score Compatibility score
   * @param summary Summary of the match
   * @param extra Optional analysis details to persist on the match
   * @returns The created (or existing) match
   */
  async createMatch(
    userA: string,
    userB: string,
    score: number,
    summary: string,
    extra?: {
      confidenceScore?: number;
      strengths?: string[];
      weaknesses?: string[];
      recommendation?: string;
      conversationId?: string;
      twinA?: string;
      twinB?: string;
    },
  ): Promise<Match> {
    const existing = await this.matchingRepository.findByUserPair(userA, userB);
    if (existing) {
      // Enrich an existing match with the latest analysis details if provided.
      if (extra) {
        const update: Partial<Match> = {
          compatibilityScore: score,
          summary,
          ...(extra.confidenceScore !== undefined && { confidenceScore: extra.confidenceScore }),
          ...(extra.strengths && { strengths: extra.strengths }),
          ...(extra.weaknesses && { weaknesses: extra.weaknesses }),
          ...(extra.recommendation && { recommendation: extra.recommendation }),
          ...(extra.conversationId && { conversationId: extra.conversationId }),
          ...(extra.twinA && { twinA: extra.twinA }),
          ...(extra.twinB && { twinB: extra.twinB }),
        };
        return this.matchingRepository.update(existing.id, update);
      }
      return existing;
    }

    const newMatch = new Match();
    newMatch.userA = userA;
    newMatch.userB = userB;
    newMatch.twinA = extra?.twinA ?? '';
    newMatch.twinB = extra?.twinB ?? '';
    newMatch.compatibilityScore = score;
    newMatch.confidenceScore = extra?.confidenceScore ?? score;
    newMatch.status = MatchStatus.PENDING;
    newMatch.summary = summary;
    newMatch.strengths = extra?.strengths ?? [];
    newMatch.weaknesses = extra?.weaknesses ?? [];
    newMatch.recommendation = extra?.recommendation ?? '';
    if (extra?.conversationId) newMatch.conversationId = extra.conversationId;

    return this.matchingRepository.create(newMatch);
  }

  /**
   * Gets a single match by ID.
   * @param matchId The match ID
   * @returns The match
   * @throws NotFoundException if the match does not exist
   */
  async getMatch(matchId: string): Promise<Match> {
    const match = await this.matchingRepository.findById(matchId);
    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }
    return match;
  }

  /**
   * Accepts an introduction between the current user and their match.
   * Transitions the match to ACTIVE (unlocking human chat) and notifies the
   * other user. Idempotent: accepting an already-active match is a no-op.
   * @param userId The accepting user's ID
   * @param matchId The match to accept
   * @returns The updated match
   */
  async acceptIntroduction(userId: string, matchId: string): Promise<Match> {
    const match = await this.getMatch(matchId);

    if (match.userA !== userId && match.userB !== userId) {
      throw new ForbiddenException('You are not a participant in this match.');
    }

    if (match.status === MatchStatus.REJECTED) {
      throw new BadRequestException('This introduction was already declined.');
    }

    if (match.status === MatchStatus.ACTIVE) {
      return match;
    }

    const updated = await this.matchingRepository.updateStatus(matchId, MatchStatus.ACTIVE);

    // Notify the other participant that the introduction was accepted.
    const otherUserId = match.userA === userId ? match.userB : match.userA;
    try {
      await this.notificationsService.createNotification(
        otherUserId,
        NotificationType.MATCH_FOUND,
        'Introduction accepted',
        'Your match accepted the introduction. You can now start chatting!',
        { matchId },
      );
    } catch (err) {
      this.logger.warn(`Failed to send accept-introduction notification: ${(err as Error).message}`);
    }

    return updated;
  }
}
