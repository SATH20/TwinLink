import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
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
      const conversationData: Partial<Conversation> = {
        twinA: userTwin.id,
        twinB: targetTwin.id,
        userA: userId,
        userB: dto.targetUserId,
        messages: aiResult.messages,
        summary: aiResult.summary,
        topicsDiscussed: aiResult.topicsDiscussed,
        emotionalTone: aiResult.emotionalTone,
        compatibilityScore: 0,
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
   */
  private async triggerCompatibilityAnalysis(conversationId: string): Promise<void> {
    await this.compatibilityService.analyzeCompatibility(conversationId);
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
   * Get all conversations for a user.
   * @param userId The user's ID
   * @returns Array of conversations
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findByUserId(userId);
  }
}
