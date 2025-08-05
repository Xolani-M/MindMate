import { createContext } from "react";

export interface IUser {
    name?: string,
    surname?: string,
    email?: string,
    password?: string,
    displayName?: string,
    emergencyContactName?: string,
    emergencyContactPhone?: string,
}

export interface IAuthStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean; 
    user?: IUser;
}

export interface IAuthActionContext {
    registerSeeker: (user: IUser) => Promise<void>;
    loginUser: (user: IUser) => Promise<void>;
}

export const INITIAL_STATE: IAuthStateContext = {
    isPending: false,
    isSuccess: false,
    isError: false,
}

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext>(undefined!);
