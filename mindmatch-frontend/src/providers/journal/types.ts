import { EmotionalState } from '../seeker/types';

export interface IJournalEntry {
  id?: string;
  seekerId: string;
  entryText: string;
  moodScore: number;
  emotion: string;
  emotionalState?: EmotionalState;
  createdAt?: string;
}
