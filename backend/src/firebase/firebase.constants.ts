/**
 * Injection token for the fully-initialized Firestore instance.
 *
 * Provided by an async factory (see firebase.providers.ts) so that any
 * consumer — including repositories — receives a ready-to-use Firestore
 * instance at construction time, with no lifecycle race.
 */
export const FIRESTORE = 'FIRESTORE';
