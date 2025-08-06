import { handleActions } from "redux-actions";
import { ASSESSMENT_INITIAL_STATE, IAssessmentStateContext } from "./context";
import { AssessmentActionEnums } from "./actions";

export const AssessmentReducer = handleActions<IAssessmentStateContext, IAssessmentStateContext>({
  [AssessmentActionEnums.getAllPending]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.getAllSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.getAllError]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.getPending]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.getSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.getError]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.createPending]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.createSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.createError]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.updatePending]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.updateSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [AssessmentActionEnums.updateError]: (state, action) => ({ ...state, ...action.payload }),
}, ASSESSMENT_INITIAL_STATE);
