"use client";
import React, { useReducer, useContext, useMemo, useCallback } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { MoodStateContext, MoodActionContext, MOOD_INITIAL_STATE } from "./context";
import { IMood } from "./types";
import { MoodReducer } from "./reducer";
import {
  getRecentPending,
  getRecentSuccess,
  getRecentError,
  getTrendPending,
  getTrendSuccess,
  getTrendError,
  createPending,
  createSuccess,
  createError,
} from "./actions";

export const MoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(MoodReducer, MOOD_INITIAL_STATE);

  const handleError = (err: unknown, defaultMessage: string): string => {
    if (typeof err === "object" && err !== null) {
      const error = err as { 
        response?: { 
          data?: { 
            error?: { message?: string };
            message?: string;
          } 
        }; 
        message?: string 
      };
      
      return error?.response?.data?.error?.message || 
             error?.response?.data?.message || 
             error?.message || 
             defaultMessage;
    }
    return defaultMessage;
  };

  const getRecent = useCallback(async (): Promise<void> => {
    dispatch(getRecentPending());
    try {
      const { data } = await axiosInstance.get("/api/services/app/Mood/GetRecent");
      dispatch(getRecentSuccess(data.result || []));
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch recent moods");
  // Error handling removed for production cleanliness
      dispatch(getRecentError(errorMsg));
    }
  }, []);

  const getTrend = useCallback(async (): Promise<void> => {
    dispatch(getTrendPending());
    try {
      const { data } = await axiosInstance.get("/api/services/app/Mood/GetMoodTrend");
      dispatch(getTrendSuccess(data.result));
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch mood trend");
  // Error handling removed for production cleanliness
      dispatch(getTrendError(errorMsg));
    }
  }, []);

  const create = useCallback(async (payload: Partial<IMood>): Promise<void> => {
    if (!payload.level) {
      dispatch(createError("Mood level is required"));
      return;
    }

    dispatch(createPending());
    try {
      const { data } = await axiosInstance.post("/api/services/app/Mood/Create", payload);
      dispatch(createSuccess(data.result));
      // Refresh recent moods after creating
      await getRecent();
    } catch (err) {
      const errorMsg = handleError(err, "Failed to create mood entry");
  // Error handling removed for production cleanliness
      dispatch(createError(errorMsg));
    }
  }, [getRecent]);

  const reset = useCallback((): void => {
    dispatch(getRecentSuccess([]));
    dispatch(getRecentError(""));
    dispatch(getTrendError(""));
    dispatch(createError(""));
  }, []);

  const actions = useMemo(() => ({ getRecent, getTrend, create, reset }), [getRecent, getTrend, create, reset]);
  return (
    <MoodStateContext.Provider value={state}>
      <MoodActionContext.Provider value={actions}>
        {children}
      </MoodActionContext.Provider>
    </MoodStateContext.Provider>
  );
};

export const useMoodState = () => {
  const context = useContext(MoodStateContext);
  if (!context) {
    throw new Error("useMoodState must be used within a MoodProvider");
  }
  return context;
};

export const useMoodActions = () => {
  const context = useContext(MoodActionContext);
  if (!context) {
    throw new Error("useMoodActions must be used within a MoodProvider");
  }
  return context;
};
