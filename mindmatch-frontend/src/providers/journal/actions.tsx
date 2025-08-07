import { createAction } from "redux-actions";
import { IJournalStateContext } from "./context";
import { IJournalEntry } from "./types";

export enum JournalActionEnums {
  getEntriesPending = "GET_ENTRIES_PENDING",
  getEntriesSuccess = "GET_ENTRIES_SUCCESS",
  getEntriesError = "GET_ENTRIES_ERROR",
  createPending = "CREATE_PENDING",
  createSuccess = "CREATE_SUCCESS",
  createError = "CREATE_ERROR",
  updatePending = "UPDATE_PENDING",
  updateSuccess = "UPDATE_SUCCESS",
  updateError = "UPDATE_ERROR",
  deletePending = "DELETE_PENDING",
  deleteSuccess = "DELETE_SUCCESS",
  deleteError = "DELETE_ERROR",
}

export const getEntriesPending = createAction<IJournalStateContext>(JournalActionEnums.getEntriesPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const getEntriesSuccess = createAction<IJournalStateContext, IJournalEntry[]>(JournalActionEnums.getEntriesSuccess, (entries: IJournalEntry[]) => ({ isPending: false, isSuccess: true, isError: false, entries, error: null }));
export const getEntriesError = createAction<IJournalStateContext, string>(JournalActionEnums.getEntriesError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const createPending = createAction<IJournalStateContext>(JournalActionEnums.createPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const createSuccess = createAction<IJournalStateContext, IJournalEntry>(JournalActionEnums.createSuccess, (entry: IJournalEntry) => ({ isPending: false, isSuccess: true, isError: false, entries: [entry], error: null }));
export const createError = createAction<IJournalStateContext, string>(JournalActionEnums.createError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const updatePending = createAction<IJournalStateContext>(JournalActionEnums.updatePending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const updateSuccess = createAction<IJournalStateContext, IJournalEntry>(JournalActionEnums.updateSuccess, (entry: IJournalEntry) => ({ isPending: false, isSuccess: true, isError: false, entries: [entry], error: null }));
export const updateError = createAction<IJournalStateContext, string>(JournalActionEnums.updateError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const deletePending = createAction<IJournalStateContext>(JournalActionEnums.deletePending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const deleteSuccess = createAction<IJournalStateContext>(JournalActionEnums.deleteSuccess, () => ({ isPending: false, isSuccess: true, isError: false, entries: [], error: null }));
export const deleteError = createAction<IJournalStateContext, string>(JournalActionEnums.deleteError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));
