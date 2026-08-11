/**
 * A single human chat message exchanged between two connected users.
 * Messages are always scoped to a single Connection (the one source of truth
 * for whether two users are allowed to chat), keyed by `connectionId`.
 */
export class Message {
  id: string;
  connectionId: string;
  /** The user id (Clerk id) of the sender. */
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
