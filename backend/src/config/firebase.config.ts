import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './private.json',
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}));
