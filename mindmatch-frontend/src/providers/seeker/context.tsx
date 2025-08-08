import { createContext } from "react";
import { ISeeker, ISeekerDashboard } from "./types";

export interface ISeekerStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  profile?: ISeeker | null;
  seekerDashboard?: ISeekerDashboard | null;
  seekerDashboardPending?: boolean;
  seekerDashboardError?: string | null;
  error?: string | null;
}

export interface ISeekerActionContext {
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<ISeeker>) => Promise<void>;
  setProfile: (profile: ISeeker | null) => void;
  resetProfile: () => void;
  getMyDashboard: () => Promise<void>;
}

export const SEEKER_INITIAL_STATE: ISeekerStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  profile: null,
  seekerDashboard: null,
  seekerDashboardPending: false,
  seekerDashboardError: null,
  error: null,
};

export const SeekerStateContext = createContext<ISeekerStateContext>(SEEKER_INITIAL_STATE);
export const SeekerActionContext = createContext<ISeekerActionContext | undefined>(undefined);
