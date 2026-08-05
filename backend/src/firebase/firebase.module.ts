import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { firestoreProvider } from './firebase.providers';
import { FIRESTORE } from './firebase.constants';

/**
 * Global Firebase Module
 *
 * Initializes Firestore exactly once via an async factory provider
 * ({@link firestoreProvider}) and exposes both the raw {@link FIRESTORE}
 * instance and the {@link FirebaseService} wrapper for dependent modules.
 *
 * Because the factory is resolved before any dependent provider is
 * constructed, repositories can safely receive Firestore through DI.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [firestoreProvider, FirebaseService],
  exports: [firestoreProvider, FIRESTORE, FirebaseService],
})
export class FirebaseModule {}
