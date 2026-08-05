import * as admin from 'firebase-admin';

/**
 * Returns the current date and time as a UTC ISO string.
 */
export const nowISO = (): string => new Date().toISOString();

/**
 * Converts a JavaScript Date object to a Firestore Timestamp.
 */
export const toFirestoreTimestamp = (date: Date): admin.firestore.Timestamp => {
  return admin.firestore.Timestamp.fromDate(date);
};

/**
 * Converts a Firestore Timestamp to a JavaScript Date object.
 */
export const fromFirestoreTimestamp = (timestamp: admin.firestore.Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Adds a specified number of minutes to a Date object.
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

/**
 * Adds a random amount of jitter (in minutes) up to a max value to a Date object.
 */
export const addJitter = (date: Date, maxJitterMinutes: number): Date => {
  const jitter = Math.random() * maxJitterMinutes;
  return addMinutes(date, jitter);
};
