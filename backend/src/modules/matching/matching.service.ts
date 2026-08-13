import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { MatchingRepository } from './matching.repository';
import { CandidateFilterEngine } from './engine/candidate-filter.engine';
import { ScoringEngine, ScoredCandidate } from './engine/scoring.engine';
import { Match } from './entities/match.entity';
import { MatchStatus } from './enums/match-status.enum';
import { ProfilesService } from '../profiles/profiles.service';
import { TwinsService } from '../twins/twins.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TwinStatus } from '../twins/enums/twin-status.enum';

/**
 * Service for handling matching logic.
 */
@Injectable()
export class MatchingService {
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
   * @returns Array of scored candidates
   */
  async startMatching(userId: string, maxCandidates: number = 10): Promise<ScoredCandidate[]> {
    // 1. Get user's profile (throws NotFoundException if missing)
    const userProfile = await this.profilesService.getProfile(userId);

    // 2. Get user's twin (throws NotFoundException if missing)
    const twin = await this.twinsService.getTwin(userId);
    if ((twin.status as string) === 'INACTIVE') {
      throw new NotFoundException('Twin not found or inactive');
    }

    // 3. Set twin status to SEARCHING
    await this.twinsService.updateStatus(twin.id, TwinStatus.SEARCHING);

    // 4. Fetch all profiles (exclude current user)
    // Profiles are keyed to users via `userId`, not the profile document `id`.
    const allProfiles = await this.profilesService.getAllProfiles();
    const candidates = allProfiles.filter((p) => p.userId !== userId);

    // 5. Run through CandidateFilterEngine
    const filteredResults = this.filterEngine.filterCandidates(userProfile, candidates);
    const validCandidates = filteredResults.filter((r: any) => !r.eliminatedBy).map((r: any) => r.profile);

    // 6. Run through ScoringEngine
    const scoredCandidates = validCandidates.map((c: any) => this.scoringEngine.scoreCandidate(userProfile, c));

    // 7. Return top N scored candidates
    return this.scoringEngine.rankCandidates(scoredCandidates, maxCandidates);
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
   * @returns The created match
   */
  async createMatch(userA: string, userB: string, score: number, summary: string): Promise<Match> {
    const existing = await this.matchingRepository.findByUserPair(userA, userB);
    if (existing) return existing;

    const newMatch = new Match();
    newMatch.userA = userA;
    newMatch.userB = userB;
    newMatch.compatibilityScore = score;
    newMatch.confidenceScore = 80; // Placeholder
    newMatch.status = MatchStatus.PENDING;
    newMatch.summary = summary;
    newMatch.strengths = [];
    newMatch.weaknesses = [];
    newMatch.recommendation = 'Proceed with caution';
    
    return this.matchingRepository.create(newMatch);
  }
}
