import { handleActions, Action } from "redux-actions";
import { INITIAL_STATE, IAuthStateContext } from "./context";
import { AuthActionEnums } from "./actions";

export const AuthReducer = handleActions<IAuthStateContext, IAuthStateContext>({
    [AuthActionEnums.registerSeekerPending]: (state: IAuthStateContext, action: Action<IAuthStateContext>) => ({
        ...state,
        ...action.payload,
    }),
    [AuthActionEnums.registerSeekerSuccess]: (state: IAuthStateContext, action: Action<IAuthStateContext>) => ({
        ...state,
        ...action.payload,
    }),
    [AuthActionEnums.registerSeekerError]: (state: IAuthStateContext, action: Action<IAuthStateContext>) => ({
        ...state,
        ...action.payload,
    }),
    [AuthActionEnums.loginUserPending]: (state: IAuthStateContext, action: Action<IAuthStateContext>) => ({
        ...state,
        ...action.payload,
    }),
    [AuthActionEnums.loginUserSuccess]: (state: IAuthStateContext, action: Action<IAuthStateContext>) => ({
        ...state,
        ...action.payload,
    }),
    [AuthActionEnums.loginUserError]: (state: IAuthStateContext, action: Action<IAuthStateContext>) => ({
        ...state,
        ...action.payload,
    })
}, INITIAL_STATE);
