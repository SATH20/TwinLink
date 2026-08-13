import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
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
    return this.conversationService.getConversation(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getUserConversations(@CurrentUser('userId') userId: string): Promise<Conversation[]> {
    return this.conversationService.getUserConversations(userId);
  }
}
