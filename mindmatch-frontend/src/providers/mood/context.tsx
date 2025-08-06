import { createContext } from "react";
import { IMood } from "./types";

export interface IMoodStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  moods?: IMood[];
  error?: string | null;
}

export interface IMoodActionContext {
  getRecent: () => Promise<void>;
  getTrend: () => Promise<void>;
  create: (data: Partial<IMood>) => Promise<void>;
  reset: () => void;
}

export const MOOD_INITIAL_STATE: IMoodStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  moods: [],
  error: null,
};

export const MoodStateContext = createContext<IMoodStateContext>(MOOD_INITIAL_STATE);
export const MoodActionContext = createContext<IMoodActionContext | undefined>(undefined);
