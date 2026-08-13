import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { AppNotification } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository extends FirebaseRepository<AppNotification> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'notifications');
  }

  /**
   * Find all notifications for a specific user, ordered by creation date descending
   * @param userId User's ID
   * @returns Array of notifications
   */
  async findByUserId(userId: string): Promise<AppNotification[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as AppNotification));
  }

  /**
   * Find all unread notifications for a specific user
   * @param userId User's ID
   * @returns Array of unread notifications
   */
  async findUnread(userId: string): Promise<AppNotification[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as AppNotification));
  }

  /**
   * Mark a notification as read
   * @param notificationId Notification's ID
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.update(notificationId, { read: true });
  }
}
