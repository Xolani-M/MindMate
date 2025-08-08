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

  const getAll = async () => {
    dispatch(getAllPending());
    try {
      const { data } = await axiosInstance.get("/services/app/Assessment/GetAll");
      dispatch(getAllSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to fetch assessments";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(getAllError(errorMsg));
    }
  };

  const get = async (id: number) => {
    dispatch(getPending());
    try {
      const { data } = await axiosInstance.get(`/services/app/Assessment/Get?id=${id}`);
      dispatch(getSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to fetch assessment";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(getError(errorMsg));
    }
  };

  const create = async (payload: Partial<IAssessment>) => {
    dispatch(createPending());
    try {
      const { data } = await axiosInstance.post("/services/app/Assessment/Create", payload);
      dispatch(createSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to create assessment";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(createError(errorMsg));
    }
  };

  const update = async (payload: Partial<IAssessment>) => {
    dispatch(updatePending());
    try {
      const { data } = await axiosInstance.put("/services/app/Assessment/Update", payload);
      dispatch(updateSuccess(data.result));
    } catch (err) {
      let errorMsg = "Failed to update assessment";
      if (typeof err === "object" && err !== null) {
        errorMsg = (err as { response?: { data?: { error?: { message?: string } } }, message?: string })?.response?.data?.error?.message || (err as { message?: string })?.message || errorMsg;
      }
      dispatch(updateError(errorMsg));
    }
  };

  const reset = () => {
    dispatch(getAllSuccess([]));
    dispatch(getAllError(""));
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
