import { Injectable, Inject, forwardRef, NotFoundException, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ConversationService } from '../conversation/conversation.service';
import { ProfilesService } from '../profiles/profiles.service';
import { MatchingService } from '../matching/matching.service';
import { CompatibilityResult } from './interfaces/compatibility-result.interface';
import { TwinsService } from '../twins/twins.service';
import { CompatibilityRequestDto } from '../ai/dto/compatibility-request.dto';

/**
 * Service for analyzing compatibility between two users based on their twin conversation.
 */
@Injectable()
export class CompatibilityService {
  private readonly logger = new Logger(CompatibilityService.name);

  constructor(
    private readonly aiService: AiService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    private readonly profilesService: ProfilesService,
    @Inject(forwardRef(() => MatchingService))
    private readonly matchingService: MatchingService,
    private readonly twinsService: TwinsService,
  ) {}

  /**
   * Analyzes the compatibility of two users based on a conversation between their twins.
   * @param conversationId The ID of the conversation to analyze
   * @returns Compatibility result details
   */
  async analyzeCompatibility(conversationId: string): Promise<CompatibilityResult> {
    // 1. Get conversation
    const conversation = await this.conversationService.getConversation(conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    try {
      // 2. Get both users' profiles
      const profileA = await this.profilesService.getProfile(conversation.userA);
      const profileB = await this.profilesService.getProfile(conversation.userB);

      // 3. Build CompatibilityRequestDto
      const requestDto: CompatibilityRequestDto = {
        transcript: conversation.messages.map((m) => ({ role: m.role, content: m.content })),
        twinAProfile: profileA as unknown as Record<string, unknown>,
        twinBProfile: profileB as unknown as Record<string, unknown>,
        conversationSummary: conversation.summary,
      };

      // 4. Call AiService.analyzeCompatibility()
      const result = await this.aiService.analyzeCompatibility(requestDto);

      // [TEMP LOG 1] Full /compatibility response keys — confirms the exact
      // field names the FastAPI engine returned so we can map them 1:1.
      this.logger.debug(
        `[TEMP][compat] /compatibility response keys for ${conversation.id}: ` +
          `${JSON.stringify(Object.keys(result ?? {}))} | ` +
          `compatibilityScore=${result?.compatibilityScore} ` +
          `confidenceScore=${result?.confidenceScore} ` +
          `recommendation=${result?.recommendation}`,
      );

      // 5. Persist the full analysis back onto the conversation FIRST so the
      //    frontend has a single source of truth (score, confidence,
      //    strengths, weaknesses, recommendation, detailed breakdown).
      //    This is written BEFORE any match/twin side-effects so a failure in
      //    those steps can never prevent `analysisComplete` from being saved
      //    (which is what left the UI stuck on "Analyzing compatibility...").
      const analysisUpdate = {
        compatibilityScore: result.compatibilityScore,
        confidenceScore: result.confidenceScore,
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
        recommendation: result.recommendation ?? '',
        detailedAnalysis: result.detailedAnalysis ?? null,
        analysisComplete: true,
        status: 'COMPLETED' as const,
      };

      // [TEMP LOG 2] Conversation update payload being persisted.
      this.logger.debug(
        `[TEMP][compat] update payload for ${conversation.id}: ${JSON.stringify(analysisUpdate)}`,
      );

      const savedConversation = await this.conversationService.updateConversation(
        conversation.id,
        analysisUpdate,
      );

      // [TEMP LOG 3] Saved conversation status (read back from the store).
      this.logger.debug(
        `[TEMP][compat] saved conversation ${conversation.id}: ` +
          `status=${savedConversation?.status} ` +
          `analysisComplete=${savedConversation?.analysisComplete} ` +
          `compatibilityScore=${savedConversation?.compatibilityScore} ` +
          `confidenceScore=${savedConversation?.confidenceScore}`,
      );

      // 6 & 7. Handle match creation + twin status as SIDE-EFFECTS. These must
      //    not undo the analysis we already persisted, so any failure here is
      //    logged but does not throw (the analysis result is still returned).
      let matchId: string | null = null;
      try {
        if (result.compatibilityScore >= 70) {
          // High compatibility: create match and set twins to MATCH_FOUND
          const match = await this.matchingService.createMatch(
            conversation.userA,
            conversation.userB,
            result.compatibilityScore,
            result.summary,
            {
              confidenceScore: result.confidenceScore,
              strengths: result.strengths,
              weaknesses: result.weaknesses,
              recommendation: result.recommendation,
              conversationId: conversation.id,
              twinA: conversation.twinA,
              twinB: conversation.twinB,
            },
          );
          matchId = match.id;

          await this.twinsService.updateStatus(conversation.twinA, 'MATCH_FOUND');
          await this.twinsService.updateStatus(conversation.twinB, 'MATCH_FOUND');

          // Link the freshly-created match back onto the conversation.
          await this.conversationService.updateConversation(conversation.id, { matchId });
        } else {
          // Low compatibility: set twins back to ACTIVE
          await this.twinsService.updateStatus(conversation.twinA, 'ACTIVE');
          await this.twinsService.updateStatus(conversation.twinB, 'ACTIVE');
        }
      } catch (sideEffectError) {
        // Analysis is already saved; a match/twin-status failure should not
        // roll the conversation back into a "still analyzing" state.
        this.logger.error(
          `Compatibility side-effects failed for conversation ${conversation.id} ` +
            `(analysis was already persisted): ${(sideEffectError as Error).message}`,
        );
      }

      // 8. Return result
      return result as CompatibilityResult;
    } catch (error) {
      // The analysis itself (AI call or persistence) failed. Mark the
      // conversation FAILED so the frontend can stop the loader instead of
      // polling forever, and best-effort revert both twins to ACTIVE.
      this.logger.error(
        `Compatibility analysis failed for conversation ${conversation.id}: ${(error as Error).message}`,
      );

      await Promise.allSettled([
        this.conversationService
          .updateConversation(conversation.id, { status: 'FAILED', analysisComplete: false })
          .catch((e) =>
            this.logger.error(
              `Failed to mark conversation ${conversation.id} as FAILED: ${(e as Error).message}`,
            ),
          ),
        this.twinsService.updateStatus(conversation.twinA, 'ACTIVE'),
        this.twinsService.updateStatus(conversation.twinB, 'ACTIVE'),
      ]);
      throw error;
    }
  }
}
