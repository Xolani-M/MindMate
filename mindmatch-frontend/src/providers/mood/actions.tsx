import { createAction } from "redux-actions";
import { IMoodStateContext } from "./context";
import { IMood } from "./types";

export enum MoodActionEnums {
  getRecentPending = "GET_RECENT_PENDING",
  getRecentSuccess = "GET_RECENT_SUCCESS",
  getRecentError = "GET_RECENT_ERROR",
  getTrendPending = "GET_TREND_PENDING",
  getTrendSuccess = "GET_TREND_SUCCESS",
  getTrendError = "GET_TREND_ERROR",
  createPending = "CREATE_PENDING",
  createSuccess = "CREATE_SUCCESS",
  createError = "CREATE_ERROR",
}

export const getRecentPending = createAction<IMoodStateContext>(MoodActionEnums.getRecentPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const getRecentSuccess = createAction<IMoodStateContext, IMood[]>(MoodActionEnums.getRecentSuccess, (moods: IMood[]) => ({ isPending: false, isSuccess: true, isError: false, moods, error: null }));
export const getRecentError = createAction<IMoodStateContext, string>(MoodActionEnums.getRecentError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const getTrendPending = createAction<IMoodStateContext>(MoodActionEnums.getTrendPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const getTrendSuccess = createAction<IMoodStateContext, IMood[]>(MoodActionEnums.getTrendSuccess, (moods: IMood[]) => ({ isPending: false, isSuccess: true, isError: false, moods, error: null }));
export const getTrendError = createAction<IMoodStateContext, string>(MoodActionEnums.getTrendError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const createPending = createAction<IMoodStateContext>(MoodActionEnums.createPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const createSuccess = createAction<IMoodStateContext, IMood>(MoodActionEnums.createSuccess, (mood: IMood) => ({ isPending: false, isSuccess: true, isError: false, moods: [mood], error: null }));
export const createError = createAction<IMoodStateContext, string>(MoodActionEnums.createError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));
