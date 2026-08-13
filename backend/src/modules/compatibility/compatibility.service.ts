import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
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

      // 5 & 6. Handle the result
      if (result.compatibilityScore >= 70) {
        // High compatibility: create match and set twins to MATCH_FOUND
        await this.matchingService.createMatch(
          conversation.userA,
          conversation.userB,
          result.compatibilityScore,
          result.summary,
        );

        await this.twinsService.updateStatus(conversation.twinA, 'MATCH_FOUND');
        await this.twinsService.updateStatus(conversation.twinB, 'MATCH_FOUND');
      } else {
        // Low compatibility: set twins back to ACTIVE
        await this.twinsService.updateStatus(conversation.twinA, 'ACTIVE');
        await this.twinsService.updateStatus(conversation.twinB, 'ACTIVE');
      }

      // 7. Return result
      return result as CompatibilityResult;
    } catch (error) {
      // On any failure, do not leave the twins stranded in EVALUATING.
      // Best-effort revert both twins to ACTIVE so they can be re-matched.
      await Promise.allSettled([
        this.twinsService.updateStatus(conversation.twinA, 'ACTIVE'),
        this.twinsService.updateStatus(conversation.twinB, 'ACTIVE'),
      ]);
      throw error;
    }
  }
}
