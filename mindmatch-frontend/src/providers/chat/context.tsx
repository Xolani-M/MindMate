import { createContext } from "react";
import { ChatState } from "./types";

export interface ChatActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  sendVoiceMessage: () => Promise<void>;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  toggleListening: () => Promise<void>;
  muteAudio: () => void;
  clearError: () => void;
  clearHistory: () => void;
}

export const ChatStateContext = createContext<ChatState>({
  messages: [],
  loading: false,
  error: undefined,
});
export const ChatActionContext = createContext<ChatActions | undefined>(undefined);

export interface ChatProviderState {
  isInitializing: boolean;
}

export const ChatProviderContext = createContext<ChatProviderState>({
  isInitializing: false,
});
