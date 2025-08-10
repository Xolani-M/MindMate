import { createAction } from "redux-actions";
import { ISeekerStateContext } from "./context";
import { ISeeker, ISeekerDashboard, IRealTimeDashboard, ITherapeuticGoals, ICrisisPrevention } from "./types";

export enum SeekerActionEnums {
  getProfilePending = "GET_PROFILE_PENDING",
  getProfileSuccess = "GET_PROFILE_SUCCESS",
  getProfileError = "GET_PROFILE_ERROR",
  updateProfilePending = "UPDATE_PROFILE_PENDING",
  updateProfileSuccess = "UPDATE_PROFILE_SUCCESS",
  updateProfileError = "UPDATE_PROFILE_ERROR",
  getDashboardPending = "GET_DASHBOARD_PENDING",
  getDashboardSuccess = "GET_DASHBOARD_SUCCESS",
  getDashboardError = "GET_DASHBOARD_ERROR",
  
  // Advanced Analytics Actions
  getRealTimeAnalyticsPending = "GET_REAL_TIME_ANALYTICS_PENDING",
  getRealTimeAnalyticsSuccess = "GET_REAL_TIME_ANALYTICS_SUCCESS",
  getRealTimeAnalyticsError = "GET_REAL_TIME_ANALYTICS_ERROR",
  
  getTherapeuticGoalsPending = "GET_THERAPEUTIC_GOALS_PENDING",
  getTherapeuticGoalsSuccess = "GET_THERAPEUTIC_GOALS_SUCCESS",
  getTherapeuticGoalsError = "GET_THERAPEUTIC_GOALS_ERROR",
  
  getCrisisPreventionPending = "GET_CRISIS_PREVENTION_PENDING",
  getCrisisPreventionSuccess = "GET_CRISIS_PREVENTION_SUCCESS",
  getCrisisPreventionError = "GET_CRISIS_PREVENTION_ERROR",
}

// Dashboard Actions
export const getDashboardPending = createAction<ISeekerStateContext>(
  SeekerActionEnums.getDashboardPending,
  () => ({
    isPending: false,
    isSuccess: false,
    isError: false,
    seekerDashboard: null,
    seekerDashboardPending: true,
    seekerDashboardError: null,
    profile: undefined,
    error: null,
  })
);

export const getDashboardSuccess = createAction<ISeekerStateContext, ISeekerDashboard>(
  SeekerActionEnums.getDashboardSuccess,
  (seekerDashboard: ISeekerDashboard) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    seekerDashboard,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    profile: undefined,
    error: null,
  })
);

export const getDashboardError = createAction<ISeekerStateContext, string>(
  SeekerActionEnums.getDashboardError,
  (error: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    seekerDashboard: null,
    seekerDashboardPending: false,
    seekerDashboardError: error,
    profile: undefined,
    error: null,
  })
);

// Real-Time Analytics Actions
export const getRealTimeAnalyticsPending = createAction<ISeekerStateContext>(
  SeekerActionEnums.getRealTimeAnalyticsPending,
  () => ({ 
    isPending: false,
    isSuccess: false,
    isError: false,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: null,
    realTimeAnalyticsPending: true,
    realTimeAnalyticsError: null,
    therapeuticGoals: undefined,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: undefined,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error: null,
  })
);

export const getRealTimeAnalyticsSuccess = createAction<ISeekerStateContext, IRealTimeDashboard>(
  SeekerActionEnums.getRealTimeAnalyticsSuccess,
  (realTimeAnalytics: IRealTimeDashboard) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals: undefined,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: undefined,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error: null,
  })
);

export const getRealTimeAnalyticsError = createAction<ISeekerStateContext, string>(
  SeekerActionEnums.getRealTimeAnalyticsError,
  (error: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: null,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: error,
    therapeuticGoals: undefined,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: undefined,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error,
  })
);

// Therapeutic Goals Actions
export const getTherapeuticGoalsPending = createAction<ISeekerStateContext>(
  SeekerActionEnums.getTherapeuticGoalsPending,
  () => ({
    isPending: false,
    isSuccess: false,
    isError: false,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: undefined,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals: null,
    therapeuticGoalsPending: true,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: undefined,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error: null,
  })
);

export const getTherapeuticGoalsSuccess = createAction<ISeekerStateContext, ITherapeuticGoals>(
  SeekerActionEnums.getTherapeuticGoalsSuccess,
  (therapeuticGoals: ITherapeuticGoals) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: undefined,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: undefined,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error: null,
  })
);

export const getTherapeuticGoalsError = createAction<ISeekerStateContext, string>(
  SeekerActionEnums.getTherapeuticGoalsError,
  (error: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: undefined,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals: null,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: error,
    crisisPreventionAnalytics: undefined,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error,
  })
);

// Crisis Prevention Actions
export const getCrisisPreventionPending = createAction<ISeekerStateContext>(
  SeekerActionEnums.getCrisisPreventionPending,
  () => ({
    isPending: false,
    isSuccess: false,
    isError: false,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: undefined,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals: undefined,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: null,
    crisisPreventionPending: true,
    crisisPreventionError: null,
    error: null,
  })
);

export const getCrisisPreventionSuccess = createAction<ISeekerStateContext, ICrisisPrevention>(
  SeekerActionEnums.getCrisisPreventionSuccess,
  (crisisPreventionAnalytics: ICrisisPrevention) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: undefined,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals: undefined,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics,
    crisisPreventionPending: false,
    crisisPreventionError: null,
    error: null,
  })
);

export const getCrisisPreventionError = createAction<ISeekerStateContext, string>(
  SeekerActionEnums.getCrisisPreventionError,
  (error: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    profile: undefined,
    seekerDashboard: undefined,
    seekerDashboardPending: false,
    seekerDashboardError: null,
    realTimeAnalytics: undefined,
    realTimeAnalyticsPending: false,
    realTimeAnalyticsError: null,
    therapeuticGoals: undefined,
    therapeuticGoalsPending: false,
    therapeuticGoalsError: null,
    crisisPreventionAnalytics: null,
    crisisPreventionPending: false,
    crisisPreventionError: error,
    error,
  })
);

// Profile Actions
export const getProfilePending = createAction<ISeekerStateContext>(
  SeekerActionEnums.getProfilePending,
  () => ({ isPending: true, isSuccess: false, isError: false, error: null })
);

export const getProfileSuccess = createAction<ISeekerStateContext, ISeeker>(
  SeekerActionEnums.getProfileSuccess,
  (profile: ISeeker) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    profile,
    error: null
  })
);

export const getProfileError = createAction<ISeekerStateContext, string>(
  SeekerActionEnums.getProfileError,
  (error: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    profile: undefined,
    error
  })
);

export const updateProfilePending = createAction<ISeekerStateContext>(
  SeekerActionEnums.updateProfilePending,
  () => ({ isPending: true, isSuccess: false, isError: false, error: null })
);

export const updateProfileSuccess = createAction<ISeekerStateContext, ISeeker>(
  SeekerActionEnums.updateProfileSuccess,
  (profile: ISeeker) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    profile,
    error: null
  })
);

export const updateProfileError = createAction<ISeekerStateContext, string>(
  SeekerActionEnums.updateProfileError,
  (error: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    error
  })
);
