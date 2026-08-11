import { ConnectionStatus } from '../enums/connection-status.enum';

/**
 * Represents a connection request between two users after AI conversation.
 */
export class Connection {
  id: string;
  currentUserId: string;
  targetUserId: string;
  conversationId: string;
  compatibilityScore: number;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}
