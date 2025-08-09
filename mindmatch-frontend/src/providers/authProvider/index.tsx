
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

        console.log('🏁 Session restoration useEffect triggered, current state:', {
            hasUser: !!state.user,
            userToken: state.user?.token ? 'present' : 'missing',
            seekerId: state.user?.seekerId,
            isSessionLoading: state.isSessionLoading
        });
        
        // Check if user is already in state to avoid overwriting fresh login
        if (state.user) {
            console.log('👤 User already in state, completing session restoration');
            dispatch(sessionRestoreComplete(state.user));
            return;
        }
        
        const token = sessionStorage.getItem('token');
        const seekerId = sessionStorage.getItem('SeekerId');
        const role = sessionStorage.getItem('role');
        const userId = sessionStorage.getItem('Id');
        
        if (token) {
            console.log('🔑 Found token in storage, attempting session restoration...');
            try {
                const decoded = decodeToken(token);
                const decodedSeekerId = decoded['seekerId'] || seekerId;
                const decodedRole = decoded[AbpTokenProperies.role] || role;
                const decodedUserId = decoded[AbpTokenProperies.nameidentifier] || userId;
                
                // Check if token is still valid (not expired)
                const currentTime = Math.floor(Date.now() / 1000);
                const tokenExp = typeof decoded.exp === 'number' ? decoded.exp : parseInt(decoded.exp || '0');
                
                if (tokenExp && currentTime >= tokenExp) {
                    // Token is expired, clear session
                    console.log('⏰ Token expired, clearing session');
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
                
                console.log('🔄 Restoring user session:', { 
                    seekerId: decodedSeekerId, 
                    role: decodedRole,
                    userId: decodedUserId,
                    hasExistingUser: !!state.user
                });
                
                dispatch(sessionRestoreComplete(user));
            } catch (error) {
                console.error('❌ Failed to restore user session:', error);
                // Clear invalid token
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('SeekerId');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('Id');
                dispatch(sessionRestoreComplete(undefined)); // Complete with no user
            }
        } else {
            console.log('🚫 No token found in storage for session restoration');
            dispatch(sessionRestoreComplete(undefined)); // Complete with no user
        }
    }, []); // Only run once on mount - don't trigger on state changes

    // Debug effect to monitor auth state changes
    useEffect(() => {
        console.log('🔄 Auth state changed:', {
            hasUser: !!state.user,
            userToken: state.user?.token ? 'present' : 'missing',
            seekerId: state.user?.seekerId,
            timestamp: new Date().toISOString()
        });
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
            
            console.log('🚀 Attempting login with payload:', {
                email: user.email,
                hasPassword: !!user.password,
                endpoint
            });
            
            const response = await instance.post(endpoint, payload);
            
            console.log('📦 Login response received:', {
                status: response.status,
                hasResult: !!response.data?.result,
                hasAccessToken: !!response.data?.result?.accessToken,
                fullResponse: response.data
            });
            
            if (!response.data?.result?.accessToken) {
                throw new Error('No access token received from server');
            }
            
            const token = response.data.result.accessToken;
            const decoded = decodeToken(token);

            console.log('🔓 Decoded token contents:', {
                allTokenData: decoded,
                tokenKeys: Object.keys(decoded)
            });

            const userRole = decoded[AbpTokenProperies.role];
            const userId = decoded[AbpTokenProperies.nameidentifier];
            const seekerId = decoded['seekerId'];

            console.log('🔑 Login successful, storing token:', {
                tokenLength: token.length,
                tokenStart: token.substring(0, 20) + '...',
                userRole,
                userId,
                seekerId
            });

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', userRole ?? '');
            sessionStorage.setItem('Id', userId ?? '');

            if (seekerId) {
                sessionStorage.setItem('SeekerId', seekerId);
            }

            console.log('✅ Token stored in sessionStorage, verifying:', {
                storedToken: sessionStorage.getItem('token')?.substring(0, 20) + '...',
                storedRole: sessionStorage.getItem('role'),
                storedId: sessionStorage.getItem('Id'),
                storedSeekerId: sessionStorage.getItem('SeekerId')
            });

            // Create user object with available data
            const userObject = { ...user, token, seekerId };
            console.log('👤 Dispatching user to state:', {
                originalUser: user,
                userObjectKeys: Object.keys(userObject),
                userObject: userObject
            });

            // Pass user object with token and seekerId to reducer
            dispatch(loginUserSuccess(userObject));
            
            console.log('🎯 Login dispatch completed, current state will update');
            
            // Immediate redirect after state update
            router.push('/seeker/dashboard');
        } catch (error: unknown) {
            console.error('Login error:', error);
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
