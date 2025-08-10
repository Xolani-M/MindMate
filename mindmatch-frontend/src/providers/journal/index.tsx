
"use client";
import React, { useReducer, useContext, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { JournalStateContext, JournalActionContext, JOURNAL_INITIAL_STATE } from "./context";
import { IJournalEntry } from "./types";
import { JournalReducer } from "./reducer";
import {
  getEntriesPending,
  getEntriesSuccess,
  getEntriesError,
  createPending,
  createSuccess,
  createError,
  updatePending,
  updateSuccess,
  updateError,
  deletePending,
  deleteSuccess,
  deleteError,
} from "./actions";

export const JournalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(JournalReducer, JOURNAL_INITIAL_STATE);

  const getEntries = async () => {
    dispatch(getEntriesPending());
    try {
      // Use GET with query parameters for GetEntries
      const { data } = await axiosInstance.get("/api/services/app/Journal/GetEntries", {
        params: {
          skipCount: 0,
          maxResultCount: 100,
          sorting: ""
        }
      });
      dispatch(getEntriesSuccess(data.result.items || data.result));
    } catch (err) {
      let errorMsg = "Failed to fetch journal entries";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(getEntriesError(errorMsg));
    }
  };

  const create = async (payload: Partial<IJournalEntry>) => {
    dispatch(createPending());
    try {
      // Backend expects: EntryText, MoodScore, Emotion (PascalCase)
      const { entryText, moodScore, emotion } = payload;
      const { data } = await axiosInstance.post("/api/services/app/Journal/Create", { 
        EntryText: entryText, 
        MoodScore: moodScore, 
        Emotion: emotion 
      });
      dispatch(createSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to create journal entry";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(createError(errorMsg));
    }
  };

  const update = async (payload: Partial<IJournalEntry>) => {
    dispatch(updatePending());
    try {
      const { data } = await axiosInstance.put("/api/services/app/Journal/Update", payload);
      dispatch(updateSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to update journal entry";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(updateError(errorMsg));
    }
  };

  const deleteJournalEntry = async (id: number) => {
    dispatch(deletePending());
    try {
      await axiosInstance.delete(`/api/services/app/Journal/Delete?id=${id}`);
      dispatch(deleteSuccess());
    } catch (err) {
      let errorMsg = "Failed to delete journal entry";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(deleteError(errorMsg));
    }
  };

  const reset = () => {
    dispatch(getEntriesSuccess([]));
    dispatch(getEntriesError(""));
  };

  const actions = useMemo(() => ({ getEntries, create, update, delete: deleteJournalEntry, reset }), []);
  return (
    <JournalStateContext.Provider value={state}>
      <JournalActionContext.Provider value={actions}>
        {children}
      </JournalActionContext.Provider>
    </JournalStateContext.Provider>
  );
};

export const useJournalState = () => {
  const context = useContext(JournalStateContext);
  if (!context) {
    throw new Error("useJournalState must be used within a JournalProvider");
  }
  return context;
};

export const useJournalActions = () => {
  const context = useContext(JournalActionContext);
  if (!context) {
    throw new Error("useJournalActions must be used within a JournalProvider");
  }
  return context;
};

// Export types
export type { IJournalEntry } from './types';
