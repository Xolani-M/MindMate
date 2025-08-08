
"use client";
import { useContext, useReducer, useMemo, useCallback, useEffect } from "react";
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

    // Initialize user state from sessionStorage on app start
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const seekerId = sessionStorage.getItem('SeekerId');
        
        if (token) {
            try {
                const decoded = decodeToken(token);
                const decodedSeekerId = decoded['seekerId'] || seekerId;
                
                // Initialize user state with existing session data
                const user: IUser = {
                    token,
                    seekerId: decodedSeekerId || undefined,
                };
                
                dispatch(loginUserSuccess(user));
            } catch (error) {
                console.error('Failed to restore user session:', error);
                // Clear invalid token
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('SeekerId');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('Id');
            }
        }
    }, []);

    // Reset Auth State
    const resetAuthState = useCallback(() => {
        dispatch({ type: 'RESET_AUTH_STATE', payload: INITIAL_STATE });
    }, [dispatch]);

    // Register Seeker
    const registerSeeker = useCallback(async (user: IUser) => {
        dispatch(registerSeekerPending());
        const endpoint = '/api/services/app/Seeker/Create';
        console.log("🚀 Registering seeker with endpoint:", endpoint);
        console.log("🔗 Axios base URL:", instance.defaults.baseURL);
        console.log("📝 Payload:", user);
        try {
            const response = await instance.post(endpoint, user);
            // Get seekerId from response and store it
            const seekerId = response.data.result?.id;
            if (seekerId) {
                sessionStorage.setItem('SeekerId', seekerId);
            }
            dispatch(registerSeekerSuccess(response.data));
            router.push('/login');
        } catch (error) {
            console.error("❌ Registration error:", error);
            dispatch(registerSeekerError());
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }
    }, [dispatch, router, instance]);

    // Login User
    const loginUser = useCallback(async (user: IUser) => {
        dispatch(loginUserPending());
        const endpoint = '/api/TokenAuth/Authenticate';
        try {
            const payload = {
                userNameOrEmailAddress: user.email,
                password: user.password,
                rememberClient: true
            };
            const response = await instance.post(endpoint, payload);
            const token = response.data.result.accessToken;
            const decoded = decodeToken(token);

            const userRole = decoded[AbpTokenProperies.role];
            const userId = decoded[AbpTokenProperies.nameidentifier];
            const seekerId = decoded['seekerId'];

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', userRole ?? '');
            sessionStorage.setItem('Id', userId ?? '');

            if (seekerId) {
                sessionStorage.setItem('SeekerId', seekerId);
            }

            // Pass user object with token and seekerId to reducer
            dispatch(loginUserSuccess({ ...user, token, seekerId }));
            router.push('/seeker/dashboard');
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error: error.response is expected from axios
                console.error('Login error response:', error.response.data);
            }
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
            dispatch(loginUserError());
        }
    }, [dispatch, router, instance]);

    const actions = useMemo(() => ({ registerSeeker, loginUser, resetAuthState }), [registerSeeker, loginUser, resetAuthState]);
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
