import { createAction } from "redux-actions";
import { ISeekerStateContext } from "./context";
import { ISeeker, ISeekerDashboard } from "./types";

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
}
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
