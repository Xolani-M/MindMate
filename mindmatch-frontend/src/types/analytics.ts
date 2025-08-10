/**
 * @fileoverview Analytics Type Definitions
 * TypeScript interfaces that match the backend SeekerAnalyticsDto
 * Ensures type safety between frontend and backend
 */

import { EmotionalState, CrisisLevel } from '@/providers/seeker/types';

export interface SeekerAnalyticsDto {
  // Core Emotional Metrics
  currentEmotionalState: EmotionalState;
  emotionalTrend: EmotionalTrend;
  emotionalJourneyDetails: EmotionalJourneyAnalysisDto;
  
  // Mood Analytics
  moodTrends: MoodTrendsAnalysisDto;
  
  // Safety & Crisis Assessment
  crisisRiskLevel: CrisisLevel;
  
  // Insights & Recommendations
  activityInsights: string[];
  recommendedActions: string[];
  
  // Progress Tracking
  progressScore: number;
  analysisTimestamp: string;
  
  // Summary Statistics
  summaryStats: SeekerSummaryStatsDto;
}

export interface EmotionalJourneyAnalysisDto {
  currentState: EmotionalState;
  trend: EmotionalTrend;
  analyzedEntries: number;
  averagePositiveScore: number;
  averageNegativeScore: number;
  emotionalProgression: EmotionalProgressionPoint[];
  keyInsights: string[];
}

export interface MoodTrendsAnalysisDto {
  averageMoodLevel: number;
  trendDirection: string;
  analyzedDays: number;
  weeklyMoodData: WeeklyMoodDataPointDto[];
  moodStability: number;
  highestMoodPeriod: MoodPeriodDto;
  lowestMoodPeriod: MoodPeriodDto;
}

export interface DetailedMoodAnalysisDto {
  analysisPeriodDays: number;
  totalEntries: number;
  averageMoodLevel: number;
  moodDistribution: { [key: string]: number };
  weeklyTrends: WeeklyMoodDataPointDto[];
  consistencyScore: number;
  insights: string[];
}

export interface SeekerSummaryStatsDto {
  totalJournalEntries: number;
  recentJournalEntries: number;
  totalMoodEntries: number;
  recentMoodEntries: number;
  totalAssessments: number;
  daysActive: number;
  streakDays: number;
}

export interface WeeklyMoodDataPointDto {
  weekStartDate: string;
  averageMood: number;
  entryCount: number;
  highestMood: number;
  lowestMood: number;
}

export interface MoodPeriodDto {
  date: string;
  moodLevel: number;
  notes: string;
}

export interface EmotionalProgressionPoint {
  sequence: number;
  emotionalState: EmotionalState;
  positiveScore: number;
  negativeScore: number;
  netScore: number;
}

export interface RealTimeDashboardDto {
  currentEmotionalState: EmotionalState;
  immediateRiskLevel: CrisisLevel;
  liveRecommendations: string[];
  moodFluctuations: MoodFluctuationDto[];
  lastUpdated: string;
  monitoringActive: boolean;
  alertsActive: boolean;
}

export interface TherapeuticGoalsDto {
  shortTermGoals: TherapeuticGoalDto[];
  longTermGoals: TherapeuticGoalDto[];
  actionPlans: ActionPlanDto[];
  personalityProfile: PersonalityProfileDto;
  recommendedTherapies: string[];
  goalGeneratedDate: string;
  reviewRecommendedDate: string;
}

export interface CrisisPreventionDto {
  riskPrediction: CrisisRiskPredictionDto;
  triggerPatterns: TriggerPatternDto[];
  earlyWarningSignals: EarlyWarningSignalDto[];
  preventionStrategies: PreventionStrategyDto[];
  recommendedCheckInFrequency: number;
  supportNetworkRecommendations: string[];
  predictionConfidence: number;
  analysisDate: string;
}

// Supporting DTOs
export interface MoodFluctuationDto {
  timestamp: string;
  moodLevel: number;
  fluctuationRate: number;
  context: string;
}

export interface TherapeuticGoalDto {
  title: string;
  description: string;
  category: string;
  priority: number;
  estimatedDays: number;
  successMetrics: string[];
  milestones: string[];
}

export interface ActionPlanDto {
  goalTitle: string;
  steps: ActionStepDto[];
  resources: string[];
  potentialObstacles: string[];
  copingStrategies: string[];
}

export interface ActionStepDto {
  order: number;
  description: string;
  estimatedMinutes: number;
  frequency: string;
  isCompleted: boolean;
}

export interface PersonalityProfileDto {
  strengthAreas: string[];
  growthAreas: string[];
  preferredCopingStyles: string[];
  communicationPreferences: string[];
  motivationalStyle: string;
  resilienceScore: number;
}

export interface CrisisRiskPredictionDto {
  predictedRiskLevel: CrisisLevel;
  riskProbability: number;
  highRiskPeriods: string[];
  riskFactors: string[];
  protectiveFactors: string[];
}

export interface TriggerPatternDto {
  triggerType: string;
  description: string;
  frequency: number;
  severity: number;
  relatedEmotions: string[];
  commonContexts: string[];
}

export interface EarlyWarningSignalDto {
  signalType: string;
  description: string;
  daysBeforeCrisis: number;
  reliabilityScore: number;
  detectionMethods: string[];
}

export interface PreventionStrategyDto {
  strategyName: string;
  description: string;
  triggerEvent: string;
  actionSteps: string[];
  requiredResources: string[];
  effectivenessScore: number;
}

// Enums
export enum EmotionalTrend {
  Declining = 'Declining',
  Stable = 'Stable',
  Improving = 'Improving',
  Fluctuating = 'Fluctuating'
}
