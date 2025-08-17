import { IAnalyticsData } from "./context";

export enum AnalyticsActionEnums {
  getAnalyticsPending = "GET_ANALYTICS_PENDING",
  getAnalyticsSuccess = "GET_ANALYTICS_SUCCESS",
  getAnalyticsError = "GET_ANALYTICS_ERROR",
}

type GetAnalyticsPending = { type: AnalyticsActionEnums.getAnalyticsPending };
type GetAnalyticsSuccess = { type: AnalyticsActionEnums.getAnalyticsSuccess; payload: IAnalyticsData[] };
type GetAnalyticsError = { type: AnalyticsActionEnums.getAnalyticsError };

export type AnalyticsAction = GetAnalyticsPending | GetAnalyticsSuccess | GetAnalyticsError;

export const getAnalyticsPending = (): GetAnalyticsPending => ({ type: AnalyticsActionEnums.getAnalyticsPending });
export const getAnalyticsSuccess = (payload: IAnalyticsData[]): GetAnalyticsSuccess => ({ type: AnalyticsActionEnums.getAnalyticsSuccess, payload });
export const getAnalyticsError = (): GetAnalyticsError => ({ type: AnalyticsActionEnums.getAnalyticsError });
