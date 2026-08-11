import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, Logger } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { StartConversationDto } from './dto/start-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { TwinsService } from '../twins/twins.service';
import { AiService } from '../ai/ai.service';
import { CompatibilityService } from '../compatibility/compatibility.service';
import { ProfilesService } from '../profiles/profiles.service';

/**
 * Service for orchestrating twin-to-twin conversations.
 */
@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  // Conversations whose compatibility analysis is currently running in this
  // process. Prevents a page reload (which re-triggers a stuck analysis) from
  // spawning a second concurrent analysis for the same conversation.
  private readonly analysisInFlight = new Set<string>();

  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly twinsService: TwinsService,
    private readonly aiService: AiService,
    @Inject(forwardRef(() => CompatibilityService))
    private readonly compatibilityService: CompatibilityService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Start a conversation between the current user's twin and a target user's twin.
   * @param userId The current user's ID
   * @param dto Data to start the conversation
   * @returns The resulting conversation
   */
  async startConversation(userId: string, dto: StartConversationDto): Promise<Conversation> {
    // 0. Guard against a twin conversing with itself.
    if (dto.targetUserId === userId) {
      throw new BadRequestException('Cannot start a conversation between a twin and itself.');
    }

    // 1. Get both users' twins
    const userTwin = await this.twinsService.getTwin(userId);
    const targetTwin = await this.twinsService.getTwin(dto.targetUserId);

    if (userTwin.status === 'TALKING' || targetTwin.status === 'TALKING') {
      throw new BadRequestException('One or both twins are currently busy in another conversation.');
    }

    // 2. Get both users' profiles
    const userProfile = await this.profilesService.getProfile(userId);
    const targetProfile = await this.profilesService.getProfile(dto.targetUserId);

    // 3. Set both twins to TALKING status
    await this.twinsService.updateStatus(userTwin.id, 'TALKING');
    await this.twinsService.updateStatus(targetTwin.id, 'TALKING');

    try {
      // 4. Build ConversationRequestDto
      const requestDto = {
        twinA: {
          systemPrompt: userTwin.systemPrompt,
          memory: userTwin.memory,
          profile: userProfile as unknown as Record<string, unknown>,
        },
        twinB: {
          systemPrompt: targetTwin.systemPrompt,
          memory: targetTwin.memory,
          profile: targetProfile as unknown as Record<string, unknown>,
        },
        context: dto.context,
        maxTurns: dto.maxTurns,
      };

      // 5. Call AiService.runConversation()
      const aiResult = await this.aiService.runConversation(requestDto);

      // 6. Create conversation record
      const messages = Array.isArray(aiResult.messages) ? aiResult.messages : [];
      const conversationData: Partial<Conversation> = {
        twinA: userTwin.id,
        twinB: targetTwin.id,
        userA: userId,
        userB: dto.targetUserId,
        messages,
        summary: aiResult.summary,
        topicsDiscussed: aiResult.topicsDiscussed,
        emotionalTone: aiResult.emotionalTone,
        compatibilityScore: 0,
        confidenceScore: 0,
        strengths: [],
        weaknesses: [],
        recommendation: '',
        detailedAnalysis: null,
        // Default reasoning iterations to the number of messages exchanged.
        // The compatibility analysis may refine this later.
        reasoningIterations: messages.length,
        analysisComplete: false,
        matchId: null,
        status: 'COMPLETED',
      };

      const conversation = await this.conversationRepository.create(conversationData);

      // 7. Set both twins to EVALUATING status
      await this.twinsService.updateStatus(userTwin.id, 'EVALUATING');
      await this.twinsService.updateStatus(targetTwin.id, 'EVALUATING');

      // 8. Add conversation ID to both twins' memory
      await this.twinsService.addMemory(userTwin.id, 'conversation', conversation.id);
      await this.twinsService.addMemory(targetTwin.id, 'conversation', conversation.id);

      // 9. Trigger compatibility analysis asynchronously
      this.triggerCompatibilityAnalysis(conversation.id).catch((err) => {
        console.error(`Failed to analyze compatibility for conversation ${conversation.id}:`, err);
      });

      // 10. Return conversation
      return conversation;
    } catch (error) {
      // Revert status on failure
      await this.twinsService.updateStatus(userTwin.id, 'ACTIVE');
      await this.twinsService.updateStatus(targetTwin.id, 'ACTIVE');
      throw error;
    }
  }

  /**
   * Internal method to trigger compatibility analysis asynchronously.
   *
   * Guarded against concurrent/duplicate runs for the same conversation so the
   * reload self-heal (see getConversationForClient) can safely re-trigger a
   * stuck analysis without racing an analysis that is already in progress.
   */
  private async triggerCompatibilityAnalysis(conversationId: string): Promise<void> {
    if (this.analysisInFlight.has(conversationId)) {
      return;
    }
    this.analysisInFlight.add(conversationId);
    try {
      await this.compatibilityService.analyzeCompatibility(conversationId);
    } finally {
      this.analysisInFlight.delete(conversationId);
    }
  }

  /**
   * Get a conversation by ID.
   * @param conversationId The ID of the conversation
   * @returns The conversation
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }
    return conversation;
  }

  /**
   * Fetch a conversation for a client request, self-healing a stuck analysis.
   *
   * A conversation whose twins have finished talking (status COMPLETED) but
   * whose async compatibility analysis never persisted (analysisComplete=false)
   * would otherwise leave the UI stuck on "Analyzing compatibility..." forever:
   * the original analysis is fire-and-forget and can be lost to a crash,
   * restart, or a dropped promise, and a plain fetch never re-runs it. Here we
   * re-trigger the analysis (fire-and-forget, de-duplicated) so a simple page
   * reload recovers the evaluation report — the frontend poller then picks up
   * the completed result. FAILED conversations are left untouched (terminal;
   * the UI offers a retry).
   */
  async getConversationForClient(conversationId: string): Promise<Conversation> {
    const conversation = await this.getConversation(conversationId);

    if (conversation.status === 'COMPLETED' && !conversation.analysisComplete) {
      this.logger.warn(
        `Conversation ${conversation.id} is COMPLETED but analysis is incomplete — ` +
          `re-triggering compatibility analysis.`,
      );
      this.triggerCompatibilityAnalysis(conversation.id).catch((err) => {
        this.logger.error(
          `Failed to re-trigger compatibility analysis for conversation ${conversation.id}: ` +
            `${(err as Error).message}`,
        );
      });
    }

    return conversation;
  }

  /**
   * Get all conversations for a user.
   * @param userId The user's ID
   * @returns Array of conversations
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findByUserId(userId);
  }

  /**
   * Persist partial updates to a conversation (used by the compatibility
   * service to write the analysis results back onto the conversation record).
   * @param conversationId The ID of the conversation
   * @param data Partial fields to merge
   * @returns The updated conversation
   */
  async updateConversation(
    conversationId: string,
    data: Partial<Conversation>,
  ): Promise<Conversation> {
    return this.conversationRepository.update(conversationId, data);
  }
}
