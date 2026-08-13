import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { Conversation } from './entities/conversation.entity';

/**
 * Repository for Conversation entities in Firestore.
 */
@Injectable()
export class ConversationRepository extends FirebaseRepository<Conversation> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'conversations');
  }

  /**
   * Find conversations between two specific twins.
   * @param twinA ID of the first twin
   * @param twinB ID of the second twin
   * @returns Array of conversations
   */
  async findByTwinIds(twinA: string, twinB: string): Promise<Conversation[]> {
    const allConvs = await this.findAll();
    return allConvs.filter(
      (conv) =>
        (conv.twinA === twinA && conv.twinB === twinB) ||
        (conv.twinA === twinB && conv.twinB === twinA),
    );
  }

  /**
   * Find all conversations involving a specific user.
   * @param userId ID of the user
   * @returns Array of conversations
   */
  async findByUserId(userId: string): Promise<Conversation[]> {
    const asUserA = await this.findByField('userA', userId);
    const asUserB = await this.findByField('userB', userId);

    const results = new Map<string, Conversation>();
    asUserA.forEach((conv) => results.set(conv.id, conv));
    asUserB.forEach((conv) => results.set(conv.id, conv));

    return Array.from(results.values());
  }

  /**
   * Find all active (in-progress) conversations.
   * @returns Array of active conversations
   */
  async findActiveConversations(): Promise<Conversation[]> {
    return this.findByField('status', 'IN_PROGRESS');
  }
}
