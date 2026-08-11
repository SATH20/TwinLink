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
   * Find all notifications for a specific user, ordered by creation date descending.
   *
   * The ordering is done in memory (rather than a Firestore `orderBy`) so the
   * query only needs the single-field index on `userId` that Firestore provides
   * automatically, and never requires a composite index to be provisioned.
   */
  async findByUserId(userId: string): Promise<AppNotification[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();

    return snapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() } as AppNotification))
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  /**
   * Find all unread notifications for a specific user (newest first).
   *
   * Uses a single-field `userId` filter and applies the `read` filter + ordering
   * in memory, so no composite index is required.
   */
  async findUnread(userId: string): Promise<AppNotification[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();

    return snapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() } as AppNotification))
      .filter((n) => n.read === false)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  /**
   * Mark a notification as read
   * @param notificationId Notification's ID
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.update(notificationId, { read: true });
  }
}
