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

// Advanced Analytics Interfaces

export interface IRealTimeDashboard {
  currentEmotionalState: EmotionalState;
  immediateRiskLevel: CrisisLevel;
  liveRecommendations: string[];
  moodFluctuations: IMoodFluctuation[];
  lastUpdated: string;
  monitoringActive: boolean;
  alertsActive: boolean;
}

export interface ITherapeuticGoals {
  shortTermGoals: ITherapeuticGoal[];
  longTermGoals: ITherapeuticGoal[];
  actionPlans: IActionPlan[];
  personalityProfile: IPersonalityProfile;
  recommendedTherapies: string[];
  goalGeneratedDate: string;
  reviewRecommendedDate: string;
}

export interface ICrisisPrevention {
  riskPrediction: ICrisisRiskPrediction;
  triggerPatterns: ITriggerPattern[];
  earlyWarningSignals: IEarlyWarningSignal[];
  preventionStrategies: IPreventionStrategy[];
  recommendedCheckInFrequency: number;
  supportNetworkRecommendations: string[];
  predictionConfidence: number;
  analysisDate: string;
}

// Supporting interfaces
export interface IMoodFluctuation {
  timestamp: string;
  moodLevel: number;
  fluctuationRate: number;
  context: string;
}

export interface ITherapeuticGoal {
  title: string;
  description: string;
  category: string;
  priority: number;
  estimatedDays: number;
  successMetrics: string[];
  milestones: string[];
}

export interface IActionPlan {
  goalTitle: string;
  steps: IActionStep[];
  resources: string[];
  potentialObstacles: string[];
  copingStrategies: string[];
}

export interface IActionStep {
  order: number;
  description: string;
  estimatedMinutes: number;
  frequency: string;
  isCompleted: boolean;
}

export interface IPersonalityProfile {
  strengthAreas: string[];
  growthAreas: string[];
  preferredCopingStyles: string[];
  communicationPreferences: string[];
  motivationalStyle: string;
  resilienceScore: number;
}

export interface ICrisisRiskPrediction {
  predictedRiskLevel: CrisisLevel;
  riskProbability: number;
  highRiskPeriods: string[];
  riskFactors: string[];
  protectiveFactors: string[];
}

export interface ITriggerPattern {
  triggerType: string;
  description: string;
  frequency: number;
  severity: number;
  relatedEmotions: string[];
  commonContexts: string[];
}

export interface IEarlyWarningSignal {
  signalType: string;
  description: string;
  daysBeforeCrisis: number;
  reliabilityScore: number;
  detectionMethods: string[];
}

export interface IPreventionStrategy {
  strategyName: string;
  description: string;
  triggerEvent: string;
  actionSteps: string[];
  requiredResources: string[];
  effectivenessScore: number;
}

// Enums
export enum EmotionalState {
  VeryNegative = 1,
  Negative = 2,
  SlightlyNegative = 3,
  Neutral = 4,
  SlightlyPositive = 5,
  Positive = 6,
  VeryPositive = 7
}

export enum CrisisLevel {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}
