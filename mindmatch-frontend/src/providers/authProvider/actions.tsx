import { createAction } from 'redux-actions';
import { IUser, IAuthStateContext } from './context';

export enum AuthActionEnums {
    // Register Seeker
    registerSeekerPending = "REGISTER_SEEKER_PENDING",
    registerSeekerSuccess = "REGISTER_SEEKER_SUCCESS",
    registerSeekerError = "REGISTER_SEEKER_ERROR",

    // Login
    loginUserPending = "LOGIN_USER_PENDING",
    loginUserSuccess = "LOGIN_USER_SUCCESS",
    loginUserError = "LOGIN_USER_ERROR",
    
    // Session Management
    sessionRestoreComplete = "SESSION_RESTORE_COMPLETE",
}

export const registerSeekerPending = createAction<IAuthStateContext>(
    AuthActionEnums.registerSeekerPending, () => ({
        isPending: true,
        isSuccess: false,
        isError: false,
        errorMessage: undefined,
        isSessionLoading: false
    })
);

export const registerSeekerSuccess = createAction<IAuthStateContext, IUser>(
    AuthActionEnums.registerSeekerSuccess, (user: IUser) => ({
        isPending: false,
        isSuccess: true,
        isError: false,
        errorMessage: undefined,
        user,
        isSessionLoading: false
    })
);

export const registerSeekerError = createAction<IAuthStateContext, string>(
    AuthActionEnums.registerSeekerError, (errorMessage: string) => ({
        isPending: false,
        isSuccess: false,
        isError: true,
        errorMessage,
        isSessionLoading: false
    })
);

export const loginUserPending = createAction<IAuthStateContext>(
    AuthActionEnums.loginUserPending, () => ({
        isPending: true,
        isSuccess: false,
        isError: false,
        errorMessage: undefined,
        isSessionLoading: false
    })
);

export const loginUserSuccess = createAction<IAuthStateContext, IUser>(
    AuthActionEnums.loginUserSuccess, (user: IUser) => ({
        isPending: false,
        isSuccess: true,
        isError: false,
        errorMessage: undefined,
        user,
        isSessionLoading: false
    })
);

export const loginUserError = createAction<IAuthStateContext, string>(
    AuthActionEnums.loginUserError, (errorMessage: string) => ({
        isPending: false,
        isSuccess: false,
        isError: true,
        errorMessage,
        isSessionLoading: false
    })
);

export const sessionRestoreComplete = createAction<IAuthStateContext, IUser | undefined>(
    AuthActionEnums.sessionRestoreComplete, (user?: IUser) => ({
        isPending: false,
        isSuccess: false,
        isError: false,
        errorMessage: undefined,
        user,
        isSessionLoading: false
    })
);
