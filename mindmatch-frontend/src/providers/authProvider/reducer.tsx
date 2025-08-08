import { handleActions, Action } from "redux-actions";
import { INITIAL_STATE, IAuthStateContext } from "./context";
import { AuthActionEnums } from "./actions";

export const AuthReducer = handleActions<IAuthStateContext, IAuthStateContext>({
    [AuthActionEnums.registerSeekerPending]: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ..._state,
        ..._action.payload,
    }),
    [AuthActionEnums.registerSeekerSuccess]: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ..._state,
        ..._action.payload,
    }),
    [AuthActionEnums.registerSeekerError]: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ..._state,
        ..._action.payload,
    }),
    [AuthActionEnums.loginUserPending]: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ..._state,
        ..._action.payload,
    }),
    [AuthActionEnums.loginUserSuccess]: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ..._state,
        ..._action.payload,
    }),
    [AuthActionEnums.loginUserError]: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ..._state,
        ..._action.payload,
    }),
    RESET_AUTH_STATE: (_state: IAuthStateContext, _action: Action<IAuthStateContext>) => ({
        ...INITIAL_STATE
    })
}, INITIAL_STATE);
