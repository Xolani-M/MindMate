import { createContext } from "react";
import { ISeeker, ISeekerDashboard, IRealTimeDashboard, ITherapeuticGoals, ICrisisPrevention } from "./types";

export interface ISeekerStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  profile?: ISeeker | null;
  seekerDashboard?: ISeekerDashboard | null;
  seekerDashboardPending?: boolean;
  seekerDashboardError?: string | null;
  
  // Advanced Analytics State
  realTimeAnalytics?: IRealTimeDashboard | null;
  realTimeAnalyticsPending?: boolean;
  realTimeAnalyticsError?: string | null;
  
  therapeuticGoals?: ITherapeuticGoals | null;
  therapeuticGoalsPending?: boolean;
  therapeuticGoalsError?: string | null;
  
  crisisPreventionAnalytics?: ICrisisPrevention | null;
  crisisPreventionPending?: boolean;
  crisisPreventionError?: string | null;
  
  error?: string | null;
}

export interface ISeekerActionContext {
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<ISeeker>) => Promise<void>;
  setProfile: (profile: ISeeker | null) => void;
  resetProfile: () => void;
  getMyDashboard: () => Promise<void>;
  
  // Advanced Analytics Actions
  getRealTimeAnalytics: () => Promise<void>;
  getTherapeuticGoals: (analysisDepthDays?: number) => Promise<void>;
  getCrisisPreventionAnalytics: (predictionDays?: number) => Promise<void>;
  getComprehensiveAnalytics: () => Promise<unknown>;
  
  // 🤖 AI-Powered Analytics using Gemini
  getAIEmotionalAnalysis: (journalText: string) => Promise<unknown>;
  getAIPatternAnalysis: (days?: number) => Promise<unknown>;
  getAIRecommendations: (days?: number) => Promise<unknown>;
}

export const SEEKER_INITIAL_STATE: ISeekerStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  profile: null,
  seekerDashboard: null,
  seekerDashboardPending: false,
  seekerDashboardError: null,
  
  // Advanced Analytics Initial State
  realTimeAnalytics: null,
  realTimeAnalyticsPending: false,
  realTimeAnalyticsError: null,
  
  therapeuticGoals: null,
  therapeuticGoalsPending: false,
  therapeuticGoalsError: null,
  
  crisisPreventionAnalytics: null,
  crisisPreventionPending: false,
  crisisPreventionError: null,
  
  error: null,
};

export const SeekerStateContext = createContext<ISeekerStateContext>(SEEKER_INITIAL_STATE);
export const SeekerActionContext = createContext<ISeekerActionContext | undefined>(undefined);
