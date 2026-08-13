export interface ConversationMessage {
  role: 'twin_a' | 'twin_b';
  content: string;
  timestamp: string;
}

export class Conversation {
  id: string;
  twinA: string;
  twinB: string;
  userA: string;
  userB: string;
  messages: ConversationMessage[];
  summary: string;
  topicsDiscussed: string[];
  emotionalTone: string;
  compatibilityScore: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}
