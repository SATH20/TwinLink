import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Message } from './entities/message.entity';

/**
 * Human chat endpoints, scoped under a Connection so there is a single source
 * of truth for who is allowed to chat: `/v1/connections/:connectionId/messages`.
 */
@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/connections/:connectionId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get the human chat history for a connection' })
  @ApiParam({ name: 'connectionId', description: 'Connection ID' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Not connected or not a participant' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async getMessages(
    @CurrentUser('userId') userId: string,
    @Param('connectionId') connectionId: string,
  ): Promise<Message[]> {
    return this.messagesService.getMessages(userId, connectionId);
  }

  @Post()
  @ApiOperation({ summary: 'Send a human chat message in a connection' })
  @ApiParam({ name: 'connectionId', description: 'Connection ID' })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 403, description: 'Not connected or not a participant' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async sendMessage(
    @CurrentUser('userId') userId: string,
    @Param('connectionId') connectionId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<Message> {
    return this.messagesService.sendMessage(userId, connectionId, dto.content);
  }
}
