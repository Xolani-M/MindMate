
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
    loginUserError,
    sessionRestoreComplete
} from "./actions";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const instance = axiosInstance;
    const router = useRouter();

    // Initialize user state from sessionStorage on app start
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return;
        }

    // Debug log removed for production cleanliness
        
        // Check if user is already in state to avoid overwriting fresh login
        if (state.user) {
            // Debug log removed for production cleanliness
            dispatch(sessionRestoreComplete(state.user));
            return;
        }
        
        const token = sessionStorage.getItem('token');
    const seekerId = sessionStorage.getItem('SeekerId');
        
        if (token) {
            try {
                const decoded = decodeToken(token);
                const decodedSeekerId = decoded['seekerId'] || seekerId;
                
                // Check if token is still valid (not expired)
                const currentTime = Math.floor(Date.now() / 1000);
                const tokenExp = typeof decoded.exp === 'number' ? decoded.exp : parseInt(decoded.exp || '0');
                
                if (tokenExp && currentTime >= tokenExp) {
                    // Token is expired, clear session
                    // Debug log removed for production cleanliness
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('SeekerId');
                    sessionStorage.removeItem('role');
                    sessionStorage.removeItem('Id');
                    dispatch(sessionRestoreComplete(undefined)); // Complete with no user
                    return;
                }
                
                // Initialize user state with existing session data
                const user: IUser = {
                    token,
                    seekerId: decodedSeekerId || undefined,
                };
                
                // Debug log removed for production cleanliness
                
                dispatch(sessionRestoreComplete(user));
            } catch {
                // Error handling removed for production cleanliness
                // Clear invalid token
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('SeekerId');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('Id');
                dispatch(sessionRestoreComplete(undefined));
            }
        } else {
            // Debug log removed for production cleanliness
            dispatch(sessionRestoreComplete(undefined)); // Complete with no user
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount - intentionally empty deps to prevent re-runs on state changes

    // Debug effect to monitor auth state changes
    useEffect(() => {
        // Debug log removed for production cleanliness
    }, [state.user]);

    // Reset Auth State
    const resetAuthState = useCallback(() => {
        dispatch({ type: 'RESET_AUTH_STATE', payload: INITIAL_STATE });
    }, [dispatch]);

    // Helper function to extract user-friendly error messages
    const getErrorMessage = (error: unknown): string => {
        try {
            // Type guard for axios error
            const axiosError = error as {
                response?: {
                    data?: {
                        error?: { message?: string };
                        message?: string;
                    };
                    status?: number;
                };
                message?: string;
            };

            const response = axiosError.response;
            
            // Check for specific backend error messages
            if (response?.data?.error?.message) {
                const message = response.data.error.message;
                
                // Map technical errors to user-friendly messages
                if (message.includes('InvalidUserNameOrPassword')) {
                    return 'Invalid email or password. Please check your credentials and try again.';
                }
                if (message.includes('UserEmailIsNotConfirmed')) {
                    return 'Please verify your email address before logging in.';
                }
                if (message.includes('UserIsNotActive')) {
                    return 'Your account is not active. Please contact support.';
                }
                if (message.includes('LockedOut')) {
                    return 'Your account has been temporarily locked. Please try again later.';
                }
                
                return message;
            }
            
            // Check for HTTP status codes
            if (response?.status === 400 || response?.status === 401) {
                return 'Invalid email or password. Please check your credentials.';
            }
            if (response?.status === 403) {
                return 'Access denied. Please check your account status.';
            }
            if (response?.status === 429) {
                return 'Too many login attempts. Please wait a moment and try again.';
            }
            if (response?.status && response.status >= 500) {
                return 'Server error. Please try again in a moment.';
            }
            
            // Network or connection errors
            if (axiosError.message?.includes('Network Error')) {
                return 'Connection failed. Please check your internet connection.';
            }
            if (axiosError.message?.includes('timeout')) {
                return 'Request timed out. Please try again.';
            }
        } catch {
            // If error parsing fails, return default message
        }
        
        return 'Login failed. Please check your credentials and try again.';
    };

    // Register Seeker
    const registerSeeker = useCallback(async (user: IUser) => {
        dispatch(registerSeekerPending());
        const endpoint = '/api/services/app/Seeker/Create';
    // Debug logs removed for production cleanliness
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
            // Error handling removed for production cleanliness
            const errorMessage = getErrorMessage(error);
            dispatch(registerSeekerError(errorMessage));
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
            if (!response.data?.result?.accessToken) {
                throw new Error('No access token received from server');
            }
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
            const userObject = { ...user, token, seekerId };
            dispatch(loginUserSuccess(userObject));
            router.push('/seeker/dashboard');
        } catch (error: unknown) {
            // Error handling removed for production cleanliness
            const errorMessage = getErrorMessage(error);
            dispatch(loginUserError(errorMessage));
        }
    }, [dispatch, router, instance]);

    // Logout User
    const logoutUser = useCallback(() => {
        // Clear all session storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('SeekerId');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('Id');
        
        // Reset auth state
        dispatch({ type: 'RESET_AUTH_STATE', payload: INITIAL_STATE });
        
        // Redirect to login
        router.push('/auth/login');
    }, [dispatch, router]);

    const actions = useMemo(() => ({ 
        registerSeeker, 
        loginUser, 
        logoutUser, 
        resetAuthState 
    }), [registerSeeker, loginUser, logoutUser, resetAuthState]);
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
