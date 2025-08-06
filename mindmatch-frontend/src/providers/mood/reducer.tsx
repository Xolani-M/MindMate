import { handleActions } from "redux-actions";
import { MOOD_INITIAL_STATE, IMoodStateContext } from "./context";
import { MoodActionEnums } from "./actions";

export const MoodReducer = handleActions<IMoodStateContext, IMoodStateContext>({
  [MoodActionEnums.getRecentPending]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.getRecentSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.getRecentError]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.getTrendPending]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.getTrendSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.getTrendError]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.createPending]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.createSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [MoodActionEnums.createError]: (state, action) => ({ ...state, ...action.payload }),
}, MOOD_INITIAL_STATE);
