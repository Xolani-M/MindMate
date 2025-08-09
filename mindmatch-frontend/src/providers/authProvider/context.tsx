import { createContext } from "react";

export interface IUser {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    displayName?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    token?: string; // JWT token for authenticated user
    seekerId?: string; // Seeker GUID for authenticated user
}

export interface IAuthStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean; 
    errorMessage?: string; // Specific error message for user feedback
    user?: IUser;
}

export interface IAuthActionContext {
    registerSeeker: (user: IUser) => Promise<void>;
    loginUser: (user: IUser) => Promise<void>;
    resetAuthState: () => void;
}

export const INITIAL_STATE: IAuthStateContext = {
    isPending: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
}

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext>(undefined!);
