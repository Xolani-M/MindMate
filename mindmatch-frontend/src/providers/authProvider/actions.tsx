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
}

export const registerSeekerPending = createAction<IAuthStateContext>(
    AuthActionEnums.registerSeekerPending, () => ({
        isPending: true,
        isSuccess: false,
        isError: false,
        errorMessage: undefined
    })
);

export const registerSeekerSuccess = createAction<IAuthStateContext, IUser>(
    AuthActionEnums.registerSeekerSuccess, (user: IUser) => ({
        isPending: false,
        isSuccess: true,
        isError: false,
        errorMessage: undefined,
        user
    })
);

export const registerSeekerError = createAction<IAuthStateContext, string>(
    AuthActionEnums.registerSeekerError, (errorMessage: string) => ({
        isPending: false,
        isSuccess: false,
        isError: true,
        errorMessage
    })
);

export const loginUserPending = createAction<IAuthStateContext>(
    AuthActionEnums.loginUserPending, () => ({
        isPending: true,
        isSuccess: false,
        isError: false,
        errorMessage: undefined
    })
);

export const loginUserSuccess = createAction<IAuthStateContext, IUser>(
    AuthActionEnums.loginUserSuccess, (user: IUser) => ({
        isPending: false,
        isSuccess: true,
        isError: false,
        errorMessage: undefined,
        user
    })
);

export const loginUserError = createAction<IAuthStateContext, string>(
    AuthActionEnums.loginUserError, (errorMessage: string) => ({
        isPending: false,
        isSuccess: false,
        isError: true,
        errorMessage
    })
);
