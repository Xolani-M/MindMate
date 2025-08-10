import { createContext } from "react";
import { ChatState } from "./types";

export interface ChatActions {
  sendUserMessage: (text: string) => Promise<void>;
  clearError: () => void;
  clearHistory: () => void;
}

export const ChatStateContext = createContext<ChatState>({
  messages: [],
  loading: false,
  error: undefined,
});
export const ChatActionContext = createContext<ChatActions | undefined>(undefined);
