import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { Connection } from './entities/connection.entity';
import { ConnectionStatus } from './enums/connection-status.enum';

@Injectable()
export class ConnectionsRepository extends FirebaseRepository<Connection> {
  constructor(
    @Inject('FIRESTORE')
    firestore: admin.firestore.Firestore,
  ) {
    super(firestore, 'connections');
  }

  /**
   * Find connection by user pair (bidirectional).
   */
  async findByUserPair(userA: string, userB: string): Promise<Connection | null> {
    const snapshot = await this.collection
      .where('currentUserId', '==', userA)
      .where('targetUserId', '==', userB)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return this.mapDocToEntity(snapshot.docs[0]);
    }

    // Check reverse direction
    const reverseSnapshot = await this.collection
      .where('currentUserId', '==', userB)
      .where('targetUserId', '==', userA)
      .limit(1)
      .get();

    if (!reverseSnapshot.empty) {
      return this.mapDocToEntity(reverseSnapshot.docs[0]);
    }

    return null;
  }

  /**
   * Find all connections where user is involved.
   */
  async findByUserId(userId: string): Promise<Connection[]> {
    const asSender = await this.collection
      .where('currentUserId', '==', userId)
      .get();

    const asReceiver = await this.collection
      .where('targetUserId', '==', userId)
      .get();

    const connections = [
      ...asSender.docs.map(doc => this.mapDocToEntity(doc)),
      ...asReceiver.docs.map(doc => this.mapDocToEntity(doc)),
    ];

    return connections;
  }

  /**
   * Find connections by status for a user.
   */
  async findByUserIdAndStatus(userId: string, status: ConnectionStatus): Promise<Connection[]> {
    const allConnections = await this.findByUserId(userId);
    return allConnections.filter(conn => conn.status === status);
  }

  /**
   * Update connection status.
   */
  async updateStatus(id: string, status: ConnectionStatus): Promise<Connection | null> {
    await this.collection.doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return this.findById(id);
  }
}
