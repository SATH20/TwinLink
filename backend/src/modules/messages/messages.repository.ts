import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesRepository extends FirebaseRepository<Message> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'messages');
  }

  /**
   * Return all messages for a connection, ordered oldest → newest.
   *
   * The ordering is done in memory (rather than a Firestore `orderBy`) so the
   * query only needs a single-field index on `connectionId` and never requires
   * a composite index to be provisioned.
   */
  async findByConnectionId(connectionId: string): Promise<Message[]> {
    const messages = await this.findByField('connectionId', connectionId);
    return messages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }
}
