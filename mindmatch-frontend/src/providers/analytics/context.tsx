import { createContext } from "react";

// --- Analytics Types ---
export interface IAnalyticsData {
  id: string;
  metric: string;
  value: number;
  timestamp: string;
}

export interface IAnalyticsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  analytics?: IAnalyticsData[];
}

export interface IAnalyticsActionContext {
  getAnalytics: () => void;
  refreshAnalytics: () => void;
}

export const ANALYTICS_INITIAL_STATE: IAnalyticsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  analytics: [],
};

export const AnalyticsStateContext = createContext<IAnalyticsStateContext>(ANALYTICS_INITIAL_STATE);
export const AnalyticsActionContext = createContext<IAnalyticsActionContext | undefined>(undefined);
