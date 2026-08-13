import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { AppNotification } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  /**
   * Get all notifications for a user
   * @param userId User ID
   * @returns Array of notifications
   */
  async getNotifications(userId: string): Promise<AppNotification[]> {
    return this.notificationsRepository.findByUserId(userId);
  }

  /**
   * Get unread notifications for a user
   * @param userId User ID
   * @returns Array of unread notifications
   */
  async getUnreadNotifications(userId: string): Promise<AppNotification[]> {
    return this.notificationsRepository.findUnread(userId);
  }

  /**
   * Create a generic notification
   * @param userId User ID
   * @param type Notification type
   * @param title Title of the notification
   * @param message Message body
   * @param data Optional metadata payload
   * @returns The created notification
   */
  async createNotification(
    userId: string, 
    type: NotificationType, 
    title: string, 
    message: string, 
    data?: Record<string, any>
  ): Promise<AppNotification> {
    const notificationData: Omit<AppNotification, 'id'> = {
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date().toISOString(),
    };

    return this.notificationsRepository.create(notificationData);
  }

  /**
   * Mark a specific notification as read
   * @param notificationId ID of the notification
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }
    await this.notificationsRepository.markAsRead(notificationId);
  }

  /**
   * Convenience method to notify user about a match found
   * @param userId The recipient user ID
   * @param matchId The created match ID
   * @param matchedUserName The matched user's name
   * @returns The created notification
   */
  async notifyMatchFound(userId: string, matchId: string, matchedUserName: string): Promise<AppNotification> {
    return this.createNotification(
      userId,
      NotificationType.MATCH_FOUND,
      'New Match Found!',
      `You matched with ${matchedUserName}. Your digital twins hit it off!`,
      { matchId }
    );
  }

  /**
   * Convenience method to notify user about a completed conversation
   * @param userId The recipient user ID
   * @param conversationId The completed conversation ID
   * @returns The created notification
   */
  async notifyConversationComplete(userId: string, conversationId: string): Promise<AppNotification> {
    return this.createNotification(
      userId,
      NotificationType.CONVERSATION_COMPLETE,
      'Conversation Completed',
      'Your twin finished a conversation with another twin.',
      { conversationId }
    );
  }

  /**
   * Convenience method to notify user about a twin update
   * @param userId The recipient user ID
   * @returns The created notification
   */
  async notifyTwinUpdated(userId: string): Promise<AppNotification> {
    return this.createNotification(
      userId,
      NotificationType.TWIN_UPDATED,
      'Twin Updated',
      'Your digital twin has learned new things and updated its memory.'
    );
  }
}
