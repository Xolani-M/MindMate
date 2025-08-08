export interface IJournalEntry {
  id?: string;
  seekerId: string;
  entryText: string;
  moodScore: number;
  emotion: string;
  createdAt?: string;
}
