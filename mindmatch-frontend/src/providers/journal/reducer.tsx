import { handleActions } from "redux-actions";
import { JOURNAL_INITIAL_STATE, IJournalStateContext } from "./context";
import { JournalActionEnums } from "./actions";

export const JournalReducer = handleActions<IJournalStateContext, IJournalStateContext>({
  [JournalActionEnums.getEntriesPending]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.getEntriesSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.getEntriesError]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.createPending]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.createSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.createError]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.updatePending]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.updateSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.updateError]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.deletePending]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.deleteSuccess]: (state, action) => ({ ...state, ...action.payload }),
  [JournalActionEnums.deleteError]: (state, action) => ({ ...state, ...action.payload }),
}, JOURNAL_INITIAL_STATE);
