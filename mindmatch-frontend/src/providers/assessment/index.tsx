"use client";
import React, { useReducer, useContext, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { AssessmentStateContext, AssessmentActionContext, ASSESSMENT_INITIAL_STATE } from "./context";
import { IAssessment, ICreateAssessmentRequest } from "./types";
import { AssessmentReducer } from "./reducer";
import {
  getAllPending,
  getAllSuccess,
  getAllError,
  getPending,
  getSuccess,
  getError,
  createPending,
  createSuccess,
  createError,
  updatePending,
  updateSuccess,
  updateError,
} from "./actions";

export const AssessmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AssessmentReducer, ASSESSMENT_INITIAL_STATE);

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

  const getAll = async (): Promise<void> => {
    dispatch(getAllPending());
    try {
      const { data } = await axiosInstance.get("/api/services/app/Assessment/GetAll");
      dispatch(getAllSuccess(data.result || []));
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch assessments");
      console.error("Assessment getAll error:", err);
      dispatch(getAllError(errorMsg));
    }
  };

  const get = async (id: string | number): Promise<void> => {
    dispatch(getPending());
    try {
      const { data } = await axiosInstance.get(`/api/services/app/Assessment/Get?id=${id}`);
      dispatch(getSuccess(data.result));
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch assessment");
      console.error("Assessment get error:", err);
      dispatch(getError(errorMsg));
    }
  };

  const create = async (payload: ICreateAssessmentRequest): Promise<void> => {
    dispatch(createPending());
    try {
      const { data } = await axiosInstance.post("/api/services/app/Assessment/Create", payload);
      dispatch(createSuccess(data.result));
    } catch (err) {
      const errorMsg = handleError(err, "Failed to create assessment");
      console.error("Assessment create error:", err);
      dispatch(createError(errorMsg));
    }
  };

  const update = async (payload: Partial<IAssessment> & { id: string }): Promise<void> => {
    dispatch(updatePending());
    try {
      const { data } = await axiosInstance.put("/api/services/app/Assessment/Update", payload);
      dispatch(updateSuccess(data.result));
    } catch (err) {
      const errorMsg = handleError(err, "Failed to update assessment");
      console.error("Assessment update error:", err);
      dispatch(updateError(errorMsg));
    }
  };

  const reset = (): void => {
    dispatch(getAllSuccess([]));
    dispatch(getAllError(""));
    dispatch(getError(""));
    dispatch(createError(""));
    dispatch(updateError(""));
  };

  const actions = useMemo(() => ({ getAll, get, create, update, reset }), []);
  
  return (
    <AssessmentStateContext.Provider value={state}>
      <AssessmentActionContext.Provider value={actions}>
        {children}
      </AssessmentActionContext.Provider>
    </AssessmentStateContext.Provider>
  );
};

export const useAssessmentState = () => {
  const context = useContext(AssessmentStateContext);
  if (!context) {
    throw new Error("useAssessmentState must be used within an AssessmentProvider");
  }
  return context;
};

export const useAssessmentActions = () => {
  const context = useContext(AssessmentActionContext);
  if (!context) {
    throw new Error("useAssessmentActions must be used within an AssessmentProvider");
  }
  return context;
};
