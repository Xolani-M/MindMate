"use client";
import { useContext, useReducer, useMemo, useCallback } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { INITIAL_STATE, IUser, AuthStateContext, AuthActionContext } from "./context";
import { AuthReducer } from "./reducer";
import { AbpTokenProperies, decodeToken } from "@/utils/jwt";
import { useRouter } from "next/navigation";
import {
    registerSeekerPending,
    registerSeekerSuccess,
    registerSeekerError,
    loginUserPending,
    loginUserSuccess,
    loginUserError
} from "./actions";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const instance = axiosInstance;
    const router = useRouter();

    const registerSeeker = useCallback(async (user: IUser) => {
        dispatch(registerSeekerPending());
        const endpoint: string = '/api/services/app/Seeker/Create';

        await instance.post(endpoint, user)
            .then((response) => {
                dispatch(registerSeekerSuccess(response.data));
                router.push('/login');
            }).catch(() => {
                dispatch(registerSeekerError());
            });
    }, [dispatch, router, instance]);

    const loginUser = useCallback(async (user: IUser) => {
        dispatch(loginUserPending());
        const endpoint = `/TokenAuth/Authenticate`;

        await instance
            .post(endpoint, user)
            .then((response) => {
                const token = response.data.result.accessToken;
                const decoded = decodeToken(token);
                const userRole = decoded[AbpTokenProperies.role];
                const userId = decoded[AbpTokenProperies.nameidentifier];

                sessionStorage.setItem("token", token);
                sessionStorage.setItem("role", userRole);
                sessionStorage.setItem("Id", userId);

                dispatch(loginUserSuccess(token));
                router.push('/dashboard');
            })
            .catch((error) => {
                console.error(error);
                dispatch(loginUserError());
            });
    }, [dispatch, router, instance]);

    const actions = useMemo(() => ({ registerSeeker, loginUser }), [registerSeeker, loginUser]);
    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionContext.Provider value={actions}>
                {children}
            </AuthActionContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => {
    const context = useContext(AuthStateContext);
    if (!context) {
        throw new Error('useAuthState must be used within a AuthProvider');
    }
    return context;
};

export const useAuthActions = () => {
    const context = useContext(AuthActionContext);
    if (!context) {
        throw new Error('useAuthActions must be used within a AuthProvider');
    }
    return context;
};
