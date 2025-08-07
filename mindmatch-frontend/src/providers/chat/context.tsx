import { createContext } from "react";
import { ChatState } from "./types";

export const initialChatState: ChatState = {
  messages: [],
  loading: false,
  error: undefined,
};

export const ChatStateContext = createContext<ChatState>(initialChatState);
export const ChatActionContext = createContext<unknown>(undefined);
