import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.join(__dirname, '../../private.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
