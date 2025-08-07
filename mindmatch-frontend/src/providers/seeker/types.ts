export interface ISeeker {
  id: number;
  name: string;
  surname: string;
  email: string;
  displayName: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface ISeekerDashboard {
  totalJournalEntries: number;
  latestMood: string | null;
  averageMoodLast7Days: number;
  riskLevel: string;
  latestPhq9Score?: number;
  latestGad7Score?: number;
  name: string;
  displayName?: string;
}
