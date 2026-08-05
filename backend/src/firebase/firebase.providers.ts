import { Provider, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import firebaseConfig from '../config/firebase.config';
import { FIRESTORE } from './firebase.constants';

/**
 * Factory provider for the {@link FIRESTORE} token.
 *
 * A NestJS factory provider is fully resolved *before* any provider that
 * depends on it is constructed. By initializing Firebase Admin here and
 * returning the Firestore instance, every consumer (services, repositories)
 * receives an already-initialized Firestore at construction time — removing
 * the previous construction-vs-onModuleInit race entirely.
 *
 * Initialization happens exactly once: `admin.apps` is checked so hot-reloads
 * or repeated wiring never call `initializeApp` twice.
 */
export const firestoreProvider: Provider = {
  provide: FIRESTORE,
  inject: [firebaseConfig.KEY],
  useFactory: (fbConfig: ConfigType<typeof firebaseConfig>): admin.firestore.Firestore => {
    const logger = new Logger('FirebaseProvider');

    // Reuse an existing app if one is already initialized (idempotent).
    if (admin.apps.length > 0) {
      logger.log('Firebase Admin already initialized; reusing existing app.');
      return admin.firestore();
    }

    let credential: admin.credential.Credential;

    const serviceAccountPath = path.resolve(process.cwd(), fbConfig.serviceAccountPath);
    if (fs.existsSync(serviceAccountPath)) {
      logger.log(`Initializing Firebase via service account file: ${serviceAccountPath}`);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      credential = admin.credential.cert(require(serviceAccountPath));
    } else if (fbConfig.projectId && fbConfig.clientEmail && fbConfig.privateKey) {
      logger.log('Initializing Firebase via environment variables.');
      credential = admin.credential.cert({
        projectId: fbConfig.projectId,
        clientEmail: fbConfig.clientEmail,
        privateKey: fbConfig.privateKey,
      });
    } else {
      throw new Error(
        'Firebase credentials not found. Provide a service account file or env variables.',
      );
    }

    admin.initializeApp({ credential });

    const firestore = admin.firestore();
    // Convenience: ignore undefined properties on writes.
    firestore.settings({ ignoreUndefinedProperties: true });

    logger.log('Firebase Admin successfully initialized.');
    return firestore;
  },
};
