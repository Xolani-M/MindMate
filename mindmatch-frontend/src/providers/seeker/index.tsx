
"use client";
import React, { useReducer, useContext, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { SEEKER_INITIAL_STATE, SeekerActionContext, SeekerStateContext } from "./context";
import { ISeeker, ISeekerDashboard, IRealTimeDashboard, ITherapeuticGoals, ICrisisPrevention } from "./types";
import { SeekerReducer } from "./reducer";
import {
  getDashboardPending,
  getDashboardSuccess,
  getDashboardError,
  getProfilePending,
  getProfileSuccess,
  getProfileError,
  updateProfilePending,
  updateProfileSuccess,
  updateProfileError,
  getRealTimeAnalyticsPending,
  getRealTimeAnalyticsSuccess,
  getRealTimeAnalyticsError,
  getTherapeuticGoalsPending,
  getTherapeuticGoalsSuccess,
  getTherapeuticGoalsError,
  getCrisisPreventionPending,
  getCrisisPreventionSuccess,
  getCrisisPreventionError,
} from "./actions";

export const SeekerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(SeekerReducer, SEEKER_INITIAL_STATE);

  const getProfile = async () => {
    dispatch(getProfilePending());
    const endpoint = "/api/services/app/Seeker/GetMyProfile";
    await axiosInstance.get(endpoint)
      .then((response: { data: { result: ISeeker } }) => {
        dispatch(getProfileSuccess(response.data.result));
      })
      .catch((error) => {
        let errorMsg = "Failed to fetch seeker profile";
        if (typeof error === "object" && error !== null) {
          errorMsg = (error as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (error as { message?: string })?.message || errorMsg;
        }
        dispatch(getProfileError(errorMsg));
      });
  };

  const updateProfile = async (updatedData: Partial<ISeeker>) => {
    dispatch(updateProfilePending());
    const endpoint = "/api/services/app/Seeker/UpdateMyProfile";
    await axiosInstance.put(endpoint, updatedData)
      .then((response: { data: { result: ISeeker } }) => {
        dispatch(updateProfileSuccess(response.data.result));
      })
      .catch((error) => {
        let errorMsg = "Failed to update seeker profile";
        if (typeof error === "object" && error !== null) {
          errorMsg = (error as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (error as { message?: string })?.message || errorMsg;
        }
        dispatch(updateProfileError(errorMsg));
      });
  };

  // Basic dashboard
  const getMyDashboard = async () => {
    dispatch(getDashboardPending());
    const endpoint = "/api/services/app/Seeker/GetMyDashboard";
    await axiosInstance.get(endpoint)
      .then((response: { data: { result: unknown } }) => {
        dispatch(getDashboardSuccess(response.data.result as ISeekerDashboard));
      })
      .catch((error) => {
        let errorMsg = "Failed to fetch dashboard";
        if (typeof error === "object" && error !== null) {
          errorMsg = (error as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (error as { message?: string })?.message || errorMsg;
        }
        dispatch(getDashboardError(errorMsg));
      });
  };

  // Advanced Analytics Methods
  const getRealTimeAnalytics = async () => {
    dispatch(getRealTimeAnalyticsPending());
    const endpoint = "/api/services/app/SeekerAnalytics/GetRealTimeAnalytics";
    await axiosInstance.get(endpoint)
      .then((response: { data: { result: unknown } }) => {
        dispatch(getRealTimeAnalyticsSuccess(response.data.result as IRealTimeDashboard));
      })
      .catch((error) => {
        let errorMsg = "Failed to fetch real-time analytics";
        if (typeof error === "object" && error !== null) {
          errorMsg = (error as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (error as { message?: string })?.message || errorMsg;
        }
        dispatch(getRealTimeAnalyticsError(errorMsg));
      });
  };

  const getTherapeuticGoals = async (analysisDepthDays: number = 30) => {
    dispatch(getTherapeuticGoalsPending());
    const endpoint = `/api/services/app/SeekerAnalytics/GenerateTherapeuticGoals?analysisDepthDays=${analysisDepthDays}`;
    await axiosInstance.post(endpoint, { analysisDepthDays })
      .then((response: { data: { result: unknown } }) => {
        dispatch(getTherapeuticGoalsSuccess(response.data.result as ITherapeuticGoals));
      })
      .catch((error) => {
        let errorMsg = "Failed to fetch therapeutic goals";
        if (typeof error === "object" && error !== null) {
          errorMsg = (error as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (error as { message?: string })?.message || errorMsg;
        }
        dispatch(getTherapeuticGoalsError(errorMsg));
      });
  };

  const getCrisisPreventionAnalytics = async (predictionDays: number = 7) => {
    dispatch(getCrisisPreventionPending());
    const endpoint = `/api/services/app/SeekerAnalytics/GetCrisisPreventionAnalytics?predictionDays=${predictionDays}`;
    await axiosInstance.get(endpoint)
      .then((response: { data: { result: unknown } }) => {
        dispatch(getCrisisPreventionSuccess(response.data.result as ICrisisPrevention));
      })
      .catch((error) => {
        let errorMsg = "Failed to fetch crisis prevention analytics";
        if (typeof error === "object" && error !== null) {
          errorMsg = (error as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (error as { message?: string })?.message || errorMsg;
        }
        dispatch(getCrisisPreventionError(errorMsg));
      });
  };

  // Comprehensive Analytics Dashboard
  const getComprehensiveAnalytics = async () => {
    const endpoint = "/api/services/app/SeekerAnalytics/GetAnalyticsDashboard";
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data?.result;
    } catch (error: unknown) {
      console.error('Failed to fetch comprehensive analytics:', error);
      throw error;
    }
  };

  // 🤖 AI-Powered Analytics Methods using Gemini
  const getAIEmotionalAnalysis = async (journalText: string) => {
    const endpoint = "/api/services/app/SeekerAnalytics/GetAIEmotionalAnalysis";
    try {
      const response = await axiosInstance.post(endpoint, { journalText });
      return response.data?.result;
    } catch (error: unknown) {
      console.error('Failed to fetch AI emotional analysis:', error);
      throw error;
    }
  };

  const getAIPatternAnalysis = async (days: number = 30) => {
    const endpoint = `/api/services/app/SeekerAnalytics/GetAIPatternAnalysis?days=${days}`;
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data?.result;
    } catch (error: unknown) {
      console.error('Failed to fetch AI pattern analysis:', error);
      throw error;
    }
  };

  const getAIRecommendations = async (days: number = 14) => {
    const endpoint = `/api/services/app/SeekerAnalytics/GetAIRecommendations?days=${days}`;
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data?.result;
    } catch (error: unknown) {
      console.error('Failed to fetch AI recommendations:', error);
      throw error;
    }
  };

  // Add setProfile and resetProfile to match ISeekerActionContext
  const setProfile = (profile: ISeeker | null) => {
    if (profile) {
      dispatch(getProfileSuccess(profile));
    } else {
      dispatch(getProfileError("Profile reset"));
    }
  };

  const resetProfile = () => {
    dispatch(getProfileError("Profile reset"));
  };

  const actions = useMemo(() => ({ 
    getProfile, 
    updateProfile, 
    getMyDashboard, 
    setProfile, 
    resetProfile,
    // Advanced Analytics Actions
    getRealTimeAnalytics,
    getTherapeuticGoals,
    getCrisisPreventionAnalytics,
    getComprehensiveAnalytics,
    // 🤖 AI-Powered Analytics
    getAIEmotionalAnalysis,
    getAIPatternAnalysis,
    getAIRecommendations,
  }), []);

  return (
    <SeekerStateContext.Provider value={state}>
      <SeekerActionContext.Provider value={actions}>
        {children}
      </SeekerActionContext.Provider>
    </SeekerStateContext.Provider>
  );
};

export const useSeekerState = () => {
  const context = useContext(SeekerStateContext);
  if (!context) {
    throw new Error("useSeekerState must be used within a SeekerProvider");
  }
  return context;
};

export const useSeekerActions = () => {
  const context = useContext(SeekerActionContext);
  if (!context) {
    throw new Error("useSeekerActions must be used within a SeekerProvider");
  }
  return context;
};
