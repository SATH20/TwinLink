import { Controller, Post, Body, Get, Param, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { StartConversationDto } from './dto/start-conversation.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Conversation } from './entities/conversation.entity';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/conversation')
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);

  constructor(private readonly conversationService: ConversationService) {}

  @Post('start')
  @ApiOperation({ summary: 'Starts a twin-to-twin conversation' })
  @ApiBody({ type: StartConversationDto })
  @ApiResponse({ status: 201, description: 'Conversation started successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async startConversation(
    @CurrentUser('userId') userId: string,
    @Body() dto: StartConversationDto,
  ): Promise<Conversation> {
    return this.conversationService.startConversation(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by ID' })
  @ApiParam({ name: 'id', description: 'The conversation ID', type: String })
  @ApiResponse({ status: 200, description: 'The conversation' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getConversation(@Param('id') id: string): Promise<Conversation> {
    const conversation = await this.conversationService.getConversationForClient(id);

    // [TEMP LOG 4] Status returned by GET /v1/conversation/:id — confirms what
    // the frontend poller actually receives for this conversation.
    this.logger.debug(
      `[TEMP][GET /v1/conversation/${id}] status=${conversation?.status} ` +
        `analysisComplete=${conversation?.analysisComplete} ` +
        `compatibilityScore=${conversation?.compatibilityScore} ` +
        `confidenceScore=${conversation?.confidenceScore}`,
    );

    return conversation;
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getUserConversations(@CurrentUser('userId') userId: string): Promise<Conversation[]> {
    return this.conversationService.getUserConversations(userId);
  }
}
