import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIRESTORE } from './firebase.constants';

/**
 * Thin accessor around the initialized Firestore instance.
 *
 * Initialization is owned by {@link firestoreProvider} (a factory provider),
 * so this service simply receives the ready Firestore instance through DI.
 * There is no `OnModuleInit` hook anymore — the instance is guaranteed to be
 * initialized before this service (or any repository) is constructed.
 */
@Injectable()
export class FirebaseService {
  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: admin.firestore.Firestore,
  ) {}

  /**
   * Returns the initialized Firestore instance.
   */
  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }
}
