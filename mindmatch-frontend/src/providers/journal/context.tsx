import { createContext } from "react";
import { IJournalEntry } from "./types";

export interface IJournalStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  entries?: IJournalEntry[];
  error?: string | null;
}

export interface IJournalActionContext {
  getEntries: () => Promise<void>;
  create: (data: Partial<IJournalEntry>) => Promise<void>;
  update: (data: Partial<IJournalEntry>) => Promise<void>;
  delete: (id: number) => Promise<void>;
  reset: () => void;
}

export const JOURNAL_INITIAL_STATE: IJournalStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  entries: [],
  error: null,
};

export const JournalStateContext = createContext<IJournalStateContext>(JOURNAL_INITIAL_STATE);
export const JournalActionContext = createContext<IJournalActionContext | undefined>(undefined);
