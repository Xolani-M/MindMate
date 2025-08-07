import { handleActions } from "redux-actions";
import { SEEKER_INITIAL_STATE, ISeekerStateContext } from "./context";
import { SeekerActionEnums } from "./actions";
import { ISeekerDashboard } from "./types";

export const SeekerReducer = handleActions<ISeekerStateContext, ISeekerStateContext>({
  [SeekerActionEnums.getProfilePending]: (state, action) => ({ ...state, ...action.payload }),
  [SeekerActionEnums.getProfileSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [SeekerActionEnums.getProfileError]: (state, action) => ({ ...state, ...action.payload }),
  [SeekerActionEnums.updateProfilePending]: (state, action) => ({ ...state, ...action.payload }),
  [SeekerActionEnums.updateProfileSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [SeekerActionEnums.updateProfileError]: (state, action) => ({ ...state, ...action.payload }),
  [SeekerActionEnums.getDashboardPending]: (state) => ({
    ...state,
    seekerDashboard: null,
    seekerDashboardPending: true,
    seekerDashboardError: null,
  }),
  [SeekerActionEnums.getDashboardSuccess]: (state, action) => ({
    ...state,
    seekerDashboard: (action.payload as unknown) as ISeekerDashboard,
    seekerDashboardPending: false,
    seekerDashboardError: null,
  }),
  [SeekerActionEnums.getDashboardError]: (state, action) => ({
    ...state,
    seekerDashboard: null,
    seekerDashboardPending: false,
    seekerDashboardError: (action.payload as unknown) as string,
  }),
}, SEEKER_INITIAL_STATE);
