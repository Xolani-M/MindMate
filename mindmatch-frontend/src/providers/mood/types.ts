export enum MoodLevel {
  VerySad = 1,
  Sad = 2,
  Neutral = 3,
  Happy = 4,
  VeryHappy = 5
}

export interface IMood {
  id: string;
  seekerId: string;
  level: MoodLevel;
  notes?: string;
  entryDate: string;
}

export interface IMoodTrendSummary {
  averageMood?: MoodLevel;
  moodTrend?: 'Improving' | 'Declining' | 'Stable';
  entryCount: number;
}
