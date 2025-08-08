"use client";
import React, { useReducer, useContext, useMemo } from "react";
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

  const getRecent = async () => {
    dispatch(getRecentPending());
    try {
      const { data } = await axiosInstance.get("/api/services/app/Mood/GetRecent");
      dispatch(getRecentSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to fetch recent moods";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { data?: { error?: { message?: string } } }, message?: string };
        if (e.response?.data?.error?.message) {
          errorMsg = e.response.data.error.message;
        } else if (e.message) {
          errorMsg = e.message;
        }
      }
      dispatch(getRecentError(errorMsg));
    }
  };

  const getTrend = async () => {
    dispatch(getTrendPending());
    try {
      const { data } = await axiosInstance.get("/api/services/app/Mood/GetMoodTrend");
      dispatch(getTrendSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to fetch mood trend";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { data?: { error?: { message?: string } } }, message?: string };
        if (e.response?.data?.error?.message) {
          errorMsg = e.response.data.error.message;
        } else if (e.message) {
          errorMsg = e.message;
        }
      }
      dispatch(getTrendError(errorMsg));
    }
  };

  const create = async (payload: Partial<IMood>) => {
    dispatch(createPending());
    try {
      const { data } = await axiosInstance.post("/api/services/app/Mood/Create", payload);
      dispatch(createSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to create mood entry";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { data?: { error?: { message?: string } } }, message?: string };
        if (e.response?.data?.error?.message) {
          errorMsg = e.response.data.error.message;
        } else if (e.message) {
          errorMsg = e.message;
        }
      }
      dispatch(createError(errorMsg));
    }
  };

  const reset = () => {
    dispatch(getRecentSuccess([]));
    dispatch(getRecentError(""));
  };

  const actions = useMemo(() => ({ getRecent, getTrend, create, reset }), []);
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
