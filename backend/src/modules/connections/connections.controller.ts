import { Controller, Post, Get, Patch, Body, Param, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionStatusDto } from './dto/update-connection-status.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ConnectionStatus } from './enums/connection-status.enum';

@ApiTags('Connections')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a connection request after a completed AI conversation' })
  @ApiBody({ type: CreateConnectionDto })
  @ApiResponse({ status: 201, description: 'Connection request created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or conversation not completed' })
  @ApiResponse({ status: 403, description: 'Forbidden - not part of conversation' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async createConnection(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateConnectionDto,
  ) {
    const connection = await this.connectionsService.createConnection(userId, dto);
    return {
      success: true,
      message: 'Introduction request sent successfully',
      data: connection,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all connections for the current user' })
  @ApiQuery({ name: 'status', enum: ConnectionStatus, required: false })
  @ApiQuery({ name: 'conversationId', type: String, required: false })
  @ApiResponse({ status: 200, description: 'Connections retrieved successfully' })
  async getConnections(
    @CurrentUser('userId') userId: string,
    @Query('status') status?: ConnectionStatus,
    @Query('conversationId') conversationId?: string,
  ) {
    // If conversationId is provided, get that specific connection
    if (conversationId) {
      const connection = await this.connectionsService.getConnectionByConversationId(conversationId);
      return {
        success: true,
        data: connection ? [connection] : [],
      };
    }

    const connections = status
      ? await this.connectionsService.getUserConnectionsByStatus(userId, status)
      : await this.connectionsService.getUserConnections(userId);

    return {
      success: true,
      data: connections,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific connection by ID' })
  @ApiParam({ name: 'id', description: 'Connection ID' })
  @ApiResponse({ status: 200, description: 'Connection retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Not a participant in this connection' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async getConnection(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    const connection = await this.connectionsService.getConnection(id);

    // Only the two participants may read a connection's details (defense in
    // depth for the human chat — unauthorized users cannot access it).
    if (connection.currentUserId !== userId && connection.targetUserId !== userId) {
      throw new ForbiddenException('You are not a participant in this connection');
    }

    return {
      success: true,
      data: connection,
    };
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accept a connection request' })
  @ApiParam({ name: 'id', description: 'Connection ID' })
  @ApiResponse({ status: 200, description: 'Connection accepted successfully' })
  @ApiResponse({ status: 400, description: 'Connection already processed' })
  @ApiResponse({ status: 403, description: 'Only recipient can accept' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async acceptConnection(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    const connection = await this.connectionsService.acceptConnection(userId, id);
    return {
      success: true,
      message: 'Connection accepted',
      data: connection,
    };
  }

  @Patch(':id/decline')
  @ApiOperation({ summary: 'Decline a connection request' })
  @ApiParam({ name: 'id', description: 'Connection ID' })
  @ApiResponse({ status: 200, description: 'Connection declined successfully' })
  @ApiResponse({ status: 400, description: 'Connection already processed' })
  @ApiResponse({ status: 403, description: 'Only recipient can decline' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async declineConnection(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    const connection = await this.connectionsService.declineConnection(userId, id);
    return {
      success: true,
      message: 'Connection declined',
      data: connection,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update connection status' })
  @ApiParam({ name: 'id', description: 'Connection ID' })
  @ApiBody({ type: UpdateConnectionStatusDto })
  @ApiResponse({ status: 200, description: 'Connection status updated' })
  @ApiResponse({ status: 400, description: 'Invalid status or connection already processed' })
  @ApiResponse({ status: 403, description: 'Only recipient can update status' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async updateStatus(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateConnectionStatusDto,
  ) {
    const connection = await this.connectionsService.updateConnectionStatus(userId, id, dto.status);
    return {
      success: true,
      message: `Connection ${dto.status.toLowerCase()}`,
      data: connection,
    };
  }
}
