/**
 * @fileoverview AI Analytics Types for MindMate Analytics Dashboard
 * @description Defines TypeScript interfaces for AI-powered analytics results
 * @author MindMate Team
 * @version 1.0.0
 */

export interface IAIEmotionalAnalysis {
  primaryEmotion: string;
  emotionalIntensity: number;
  positivityScore: number;
  negativityScore: number;
  keyThemes: string[];
  triggers: string[];
  copingMechanisms: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  timestamp: string;
  rawResponse?: string;
  inputText?: string;
  error?: boolean;
  message?: string;
  basicAnalysis?: unknown;
}

export interface IAIPatternAnalysis {
  analyzedDays: number;
  entryCount: number;
  patterns?: string[];
  trends?: string;
  recommendations?: string[];
  confidence?: number;
  timestamp: string;
  // AI-powered advanced fields
  concernAreas?: string[];
  strengthsIdentified?: string[];
  progressIndicators?: string[];
  timeBasedPatterns?: string;
  trend?: string;
  rawResponse?: string;
  analysis?: unknown;
  error?: boolean;
  message?: string;
}

export interface IAIRecommendations {
  analyzedDays: number;
  dataPoints?: {
    journalEntries: number;
    moodEntries: number;
  };
  immediateActions: string[];
  weeklyGoals: string[];
  selfCareActivities: string[];
  copingStrategies: string[];
  professionalSupport: boolean;
  motivationalMessage: string;
  confidence: number;
  timestamp: string;
  rawResponse?: string;
  recommendations?: unknown;
  fallbackRecommendations?: string[];
  error?: boolean;
  message?: string;
}
