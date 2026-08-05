import { TwinStatus } from '../enums/twin-status.enum';

export interface TwinMemory {
  conversations: string[];
  matchHistory: string[];
  insights: string[];
  preferences: Record<string, any>;
}

export class Twin {
  id: string;
  userId: string;
  systemPrompt: string;
  memory: TwinMemory;
  status: TwinStatus;
  nextWake: string;
  lastWake: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
