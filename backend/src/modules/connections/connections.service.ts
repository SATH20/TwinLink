import { Injectable, BadRequestException, NotFoundException, ForbiddenException, forwardRef, Inject, Logger } from '@nestjs/common';
import { ConnectionsRepository } from './connections.repository';
import { Connection } from './entities/connection.entity';
import { ConnectionStatus } from './enums/connection-status.enum';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { ConversationService } from '../conversation/conversation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(ConnectionsService.name);

  constructor(
    private readonly connectionsRepository: ConnectionsRepository,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Create a connection request after a completed AI conversation.
   * This method is idempotent:
   * - If no connection exists, creates it with status PENDING
   * - If PENDING connection exists, returns it
   * - If ACCEPTED connection exists, returns it
   * - If DECLINED connection exists, throws error
   */
  async createConnection(currentUserId: string, dto: CreateConnectionDto): Promise<Connection> {
    const { targetUserId, conversationId } = dto;

    // Validate: Cannot connect with yourself
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Cannot create a connection with yourself');
    }

    // Validate: Conversation exists and is completed
    const conversation = await this.conversationService.getConversation(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.status !== 'COMPLETED') {
      throw new BadRequestException('Can only accept introduction after AI conversation is completed');
    }

    // Validate: Current user is part of this conversation
    if (conversation.userA !== currentUserId && conversation.userB !== currentUserId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Validate: Target user is part of this conversation
    if (conversation.userA !== targetUserId && conversation.userB !== targetUserId) {
      throw new BadRequestException('Target user is not part of this conversation');
    }

    // Check for existing connection (bidirectional)
    const existingConnection = await this.connectionsRepository.findByUserPair(currentUserId, targetUserId);
    
    if (existingConnection) {
      // If connection was declined, don't allow recreation
      if (existingConnection.status === ConnectionStatus.DECLINED) {
        throw new BadRequestException('This connection was previously declined');
      }

      // If already pending or accepted, return the existing connection (idempotent)
      this.logger.log(`Connection already exists between ${currentUserId} and ${targetUserId} with status ${existingConnection.status}`);
      return existingConnection;
    }

    // Create new connection
    const now = new Date().toISOString();
    const connection: Omit<Connection, 'id'> = {
      currentUserId,
      targetUserId,
      conversationId,
      compatibilityScore: conversation.compatibilityScore || 0,
      status: ConnectionStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.connectionsRepository.create(connection);

    // Send notification to target user
    try {
      const currentUser = await this.usersService.getCurrentUser(currentUserId);
      const senderName = currentUser?.name || 'Someone';
      
      await this.notificationsService.createNotification(
        targetUserId,
        NotificationType.CONNECTION_REQUEST,
        'New Connection Request',
        `${senderName} wants to connect with you.`,
        {
          connectionId: created.id,
          senderId: currentUserId,
          senderName,
          conversationId,
          compatibilityScore: connection.compatibilityScore,
        }
      );

      this.logger.log(`Notification sent to ${targetUserId} for connection request from ${currentUserId}`);
    } catch (error: any) {
      this.logger.error(`Failed to send notification: ${error?.message || 'Unknown error'}`);
      // Don't fail the connection creation if notification fails
    }

    return created;
  }

  /**
   * Get a connection by ID.
   */
  async getConnection(connectionId: string): Promise<Connection> {
    const connection = await this.connectionsRepository.findById(connectionId);
    if (!connection) {
      throw new NotFoundException('Connection not found');
    }
    return connection;
  }

  /**
   * Get all connections for a user.
   */
  async getUserConnections(userId: string): Promise<Connection[]> {
    return this.connectionsRepository.findByUserId(userId);
  }

  /**
   * Get connection by conversation ID.
   * Useful for checking if a connection exists for a specific conversation.
   */
  async getConnectionByConversationId(conversationId: string): Promise<Connection | null> {
    const allConnections = await this.connectionsRepository.findAll({ conversationId });
    return allConnections.length > 0 ? allConnections[0] : null;
  }

  /**
   * Get connections by status.
   */
  async getUserConnectionsByStatus(userId: string, status: ConnectionStatus): Promise<Connection[]> {
    return this.connectionsRepository.findByUserIdAndStatus(userId, status);
  }

  /**
   * Update connection status (accept or decline).
   */
  async updateConnectionStatus(userId: string, connectionId: string, status: ConnectionStatus): Promise<Connection> {
    const connection = await this.getConnection(connectionId);

    // Validate: User must be the target of the connection to accept/decline
    if (connection.targetUserId !== userId) {
      throw new ForbiddenException('Only the recipient can accept or decline a connection request');
    }

    // Validate: Cannot update if already accepted or declined
    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException(`Connection is already ${connection.status.toLowerCase()}`);
    }

    // Update status
    const updated = await this.connectionsRepository.updateStatus(connectionId, status);
    if (!updated) {
      throw new NotFoundException('Failed to update connection status');
    }

    // If accepted, notify the sender
    if (status === ConnectionStatus.ACCEPTED) {
      try {
        const targetUser = await this.usersService.getCurrentUser(userId);
        const acceptorName = targetUser?.name || 'Someone';

        await this.notificationsService.createNotification(
          connection.currentUserId,
          NotificationType.CONNECTION_ACCEPTED,
          'Connection Accepted',
          `The connection with ${acceptorName} is now active.`,
          {
            connectionId: updated.id,
            acceptorId: userId,
            acceptorName,
            conversationId: connection.conversationId,
          }
        );

        this.logger.log(`Connection accepted notification sent to ${connection.currentUserId}`);
      } catch (error: any) {
        this.logger.error(`Failed to send acceptance notification: ${error?.message || 'Unknown error'}`);
      }
    }

    return updated;
  }

  /**
   * Accept a connection.
   */
  async acceptConnection(userId: string, connectionId: string): Promise<Connection> {
    return this.updateConnectionStatus(userId, connectionId, ConnectionStatus.ACCEPTED);
  }

  /**
   * Decline a connection.
   */
  async declineConnection(userId: string, connectionId: string): Promise<Connection> {
    return this.updateConnectionStatus(userId, connectionId, ConnectionStatus.DECLINED);
  }
}
