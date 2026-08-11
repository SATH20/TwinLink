import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotificationsRepository } from './notifications.repository';
import { AppNotification } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';
import { FIRESTORE } from '../../firebase/firebase.constants';

/**
 * Maps a notification type to the recipient's preference key. Types not present
 * here are always delivered (they are not user-toggleable).
 */
const TYPE_TO_PREFERENCE: Partial<Record<NotificationType, string>> = {
  [NotificationType.CONNECTION_REQUEST]: 'connectionRequests',
  [NotificationType.CONNECTION_ACCEPTED]: 'connectionAccepted',
  [NotificationType.NEW_MESSAGE]: 'newMessages',
  [NotificationType.TWIN_UPDATED]: 'twinUpdates',
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    @Inject(FIRESTORE) private readonly firestore: admin.firestore.Firestore,
  ) {}

  /**
   * Whether the recipient wants to receive a notification of the given type.
   * Fail-open: any lookup error or missing preference defaults to `true`, so the
   * existing notification behavior is preserved unless a user explicitly opts out.
   */
  private async isTypeEnabledForUser(userId: string, type: NotificationType): Promise<boolean> {
    const prefKey = TYPE_TO_PREFERENCE[type];
    if (!prefKey) return true;

    try {
      const snap = await this.firestore
        .collection('profiles')
        .where('userId', '==', userId)
        .limit(1)
        .get();
      if (snap.empty) return true;
      const prefs = (snap.docs[0].data() as any)?.notificationPreferences;
      if (!prefs || prefs[prefKey] === undefined) return true;
      return prefs[prefKey] !== false;
    } catch (error: any) {
      this.logger.warn(`Notification preference lookup failed for ${userId}: ${error?.message}`);
      return true;
    }
  }

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
   * Create a generic notification, honoring the recipient's per-type
   * notification preferences. Returns `null` when the recipient has disabled
   * that notification type.
   * @param userId User ID
   * @param type Notification type
   * @param title Title of the notification
   * @param message Message body
   * @param data Optional metadata payload
   * @returns The created notification, or null if suppressed by preferences
   */
  async createNotification(
    userId: string, 
    type: NotificationType, 
    title: string, 
    message: string, 
    data?: Record<string, any>
  ): Promise<AppNotification | null> {
    const enabled = await this.isTypeEnabledForUser(userId, type);
    if (!enabled) {
      return null;
    }

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
  async notifyMatchFound(userId: string, matchId: string, matchedUserName: string): Promise<AppNotification | null> {
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
  async notifyConversationComplete(userId: string, conversationId: string): Promise<AppNotification | null> {
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
  async notifyTwinUpdated(userId: string): Promise<AppNotification | null> {
    return this.createNotification(
      userId,
      NotificationType.TWIN_UPDATED,
      'Twin Updated',
      'Your digital twin has learned new things and updated its memory.'
    );
  }
}
