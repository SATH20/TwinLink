import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { Message } from './entities/message.entity';
import { ConnectionsService } from '../connections/connections.service';
import { Connection } from '../connections/entities/connection.entity';
import { ConnectionStatus } from '../connections/enums/connection-status.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { UsersService } from '../users/users.service';

/**
 * Human chat service.
 *
 * Chat is intentionally built on top of the existing Connection record — there
 * is no separate "chat connection" concept. A message can only be read or sent
 * when:
 *   1. The connection exists, and
 *   2. Its status is ACCEPTED (the two users are actually connected), and
 *   3. The requesting user is one of the two participants.
 */
@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly connectionsService: ConnectionsService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Validate that `userId` is allowed to use the chat for `connectionId` and
   * return the underlying connection. Throws if not connected / not a member.
   */
  private async assertCanChat(userId: string, connectionId: string): Promise<Connection> {
    // getConnection throws NotFoundException if the connection does not exist.
    const connection = await this.connectionsService.getConnection(connectionId);

    const isParticipant =
      connection.currentUserId === userId || connection.targetUserId === userId;
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this connection.');
    }

    if (connection.status !== ConnectionStatus.ACCEPTED) {
      throw new ForbiddenException('You must be connected to start a chat.');
    }

    return connection;
  }

  /**
   * Get the full message history for a connection (oldest → newest).
   */
  async getMessages(userId: string, connectionId: string): Promise<Message[]> {
    await this.assertCanChat(userId, connectionId);
    return this.messagesRepository.findByConnectionId(connectionId);
  }

  /**
   * Persist a new message from `userId` in the given connection's chat.
   */
  async sendMessage(userId: string, connectionId: string, content: string): Promise<Message> {
    const connection = await this.assertCanChat(userId, connectionId);

    const now = new Date().toISOString();
    const message: Omit<Message, 'id'> = {
      connectionId,
      senderId: userId,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.messagesRepository.create(message);

    // Notify the other participant that they received a message. Fire-and-forget
    // so a notification failure never blocks the chat from working.
    void this.notifyRecipient(connection, userId);

    return created;
  }

  /**
   * Create a NEW_MESSAGE notification for the participant who is NOT the sender.
   * Never throws — chat delivery must not depend on notification success.
   */
  private async notifyRecipient(connection: Connection, senderId: string): Promise<void> {
    try {
      const recipientId =
        connection.currentUserId === senderId
          ? connection.targetUserId
          : connection.currentUserId;

      let senderName = 'Someone';
      try {
        const sender = await this.usersService.getCurrentUser(senderId);
        senderName = sender?.name || senderName;
      } catch {
        // Fall back to the generic name if the sender record can't be read.
      }

      await this.notificationsService.createNotification(
        recipientId,
        NotificationType.NEW_MESSAGE,
        'New Message',
        `${senderName} sent you a message.`,
        { connectionId: connection.id, senderId, senderName },
      );
    } catch (error: any) {
      this.logger.warn(`Failed to send new-message notification: ${error?.message || 'Unknown error'}`);
    }
  }
}
