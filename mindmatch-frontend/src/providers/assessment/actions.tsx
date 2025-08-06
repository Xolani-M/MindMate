import { createAction } from "redux-actions";
import { IAssessmentStateContext } from "./context";
import { IAssessment } from "./types";

export enum AssessmentActionEnums {
  getAllPending = "GET_ALL_PENDING",
  getAllSuccess = "GET_ALL_SUCCESS",
  getAllError = "GET_ALL_ERROR",
  getPending = "GET_PENDING",
  getSuccess = "GET_SUCCESS",
  getError = "GET_ERROR",
  createPending = "CREATE_PENDING",
  createSuccess = "CREATE_SUCCESS",
  createError = "CREATE_ERROR",
  updatePending = "UPDATE_PENDING",
  updateSuccess = "UPDATE_SUCCESS",
  updateError = "UPDATE_ERROR",
}

export const getAllPending = createAction<IAssessmentStateContext>(AssessmentActionEnums.getAllPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const getAllSuccess = createAction<IAssessmentStateContext, IAssessment[]>(AssessmentActionEnums.getAllSuccess, (assessments: IAssessment[]) => ({ isPending: false, isSuccess: true, isError: false, assessments, error: null }));
export const getAllError = createAction<IAssessmentStateContext, string>(AssessmentActionEnums.getAllError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const getPending = createAction<IAssessmentStateContext>(AssessmentActionEnums.getPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const getSuccess = createAction<IAssessmentStateContext, IAssessment>(AssessmentActionEnums.getSuccess, (assessment: IAssessment) => ({ isPending: false, isSuccess: true, isError: false, assessments: [assessment], error: null }));
export const getError = createAction<IAssessmentStateContext, string>(AssessmentActionEnums.getError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const createPending = createAction<IAssessmentStateContext>(AssessmentActionEnums.createPending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const createSuccess = createAction<IAssessmentStateContext, IAssessment>(AssessmentActionEnums.createSuccess, (assessment: IAssessment) => ({ isPending: false, isSuccess: true, isError: false, assessments: [assessment], error: null }));
export const createError = createAction<IAssessmentStateContext, string>(AssessmentActionEnums.createError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));

export const updatePending = createAction<IAssessmentStateContext>(AssessmentActionEnums.updatePending, () => ({ isPending: true, isSuccess: false, isError: false, error: null }));
export const updateSuccess = createAction<IAssessmentStateContext, IAssessment>(AssessmentActionEnums.updateSuccess, (assessment: IAssessment) => ({ isPending: false, isSuccess: true, isError: false, assessments: [assessment], error: null }));
export const updateError = createAction<IAssessmentStateContext, string>(AssessmentActionEnums.updateError, (error: string) => ({ isPending: false, isSuccess: false, isError: true, error }));
