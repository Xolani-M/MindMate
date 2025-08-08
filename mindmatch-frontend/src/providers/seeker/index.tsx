
"use client";
import React, { useReducer, useContext, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { SEEKER_INITIAL_STATE, SeekerActionContext, SeekerStateContext } from "./context";
import { ISeeker, ISeekerDashboard } from "./types";
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


  // New: getMyDashboard (no seekerId param)
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

  const actions = useMemo(() => ({ getProfile, updateProfile, getMyDashboard, setProfile, resetProfile }), []);

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
