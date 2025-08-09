import { createContext } from "react";

/**
 * User interface defining the structure of user data
 * Contains authentication and profile information for seekers
 */
export interface IUser {
    /**
     * User's first name
     */
    name?: string;
    
    /**
     * User's last name
     */
    surname?: string;
    
    /**
     * User's email address used for authentication
     */
    email?: string;
    
    /**
     * User's password for authentication
     */
    password?: string;
    
    /**
     * Display name shown in the application
     */
    displayName?: string;
    
    /**
     * Emergency contact person's name
     */
    emergencyContactName?: string;
    
    /**
     * Emergency contact person's phone number
     */
    emergencyContactPhone?: string;
    
    /**
     * JWT token for authenticated user sessions
     */
    token?: string;
    
    /**
     * Unique identifier for the seeker profile
     */
    seekerId?: string;
}

/**
 * Authentication state context interface
 * Manages the current state of authentication operations
 */
export interface IAuthStateContext {
    /**
     * Indicates if an authentication operation is in progress
     */
    isPending: boolean;
    
    /**
     * Indicates if the last authentication operation was successful
     */
    isSuccess: boolean;
    
    /**
     * Indicates if the last authentication operation failed
     */
    isError: boolean;
    
    /**
     * Specific error message for user feedback when authentication fails
     */
    errorMessage?: string;
    
    /**
     * Currently authenticated user data
     */
    user?: IUser;
    
    /**
     * Indicates if session restoration from storage is in progress
     * Used to prevent premature redirects on page reload
     */
    isSessionLoading: boolean;
}

/**
 * Authentication action context interface
 * Defines available authentication operations
 */
export interface IAuthActionContext {
    /**
     * Registers a new seeker account
     * 
     * @param user - User data for registration
     */
    registerSeeker: (user: IUser) => Promise<void>;
    
    /**
     * Authenticates an existing user
     * 
     * @param user - User credentials for login
     */
    loginUser: (user: IUser) => Promise<void>;
    
    /**
     * Logs out the current user and clears session
     */
    logoutUser: () => void;
    
    /**
     * Resets the authentication state to initial values
     */
    resetAuthState: () => void;
}

/**
 * Initial state for authentication context
 * Default values when no authentication operation has occurred
 */
export const INITIAL_STATE: IAuthStateContext = {
    isPending: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
    isSessionLoading: true, // Start with session loading true until we check storage
};

/**
 * React context for authentication state
 * Provides access to current authentication status
 */
export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);

/**
 * React context for authentication actions
 * Provides access to authentication operations
 */
export const AuthActionContext = createContext<IAuthActionContext>(undefined!);
