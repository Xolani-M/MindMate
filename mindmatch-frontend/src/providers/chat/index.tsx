
"use client";
import React, { useReducer, useContext, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";
import { IChatMessage } from "./types";
import { ChatStateContext, ChatActionContext, initialChatState } from "./context";
import { sendMessage, receiveMessage, setLoading, setError } from "./actions";
import { chatReducer } from "./reducer";


export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  const sendUserMessage = async (text: string) => {
    const userMsg: IChatMessage = {
      id: uuidv4(),
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    dispatch(sendMessage(userMsg));
    dispatch(setLoading(true));
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

      const res = await axiosInstance.post(
          "/api/services/app/Chat/GetChatbotReply",
          { message: text },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

      const botMsg: IChatMessage = {
        id: uuidv4(),
        sender: "bot",
        text: res.data.result.reply,
        createdAt: new Date().toISOString(),
      };
      dispatch(receiveMessage(botMsg));
    } catch (err: unknown) {
      console.error('Chat API Error:', err);
      
      let errorMessage = "Failed to get chatbot reply.";
      
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.status === 500) {
          errorMessage = "The chatbot service is temporarily unavailable. Please try again later.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "Please log in again to use the chatbot.";
        } else if (axiosError.response?.data?.error?.message) {
          errorMessage = axiosError.response.data.error.message;
        }
        console.error('Response data:', axiosError.response?.data);
      } else if (err instanceof Error) {
        errorMessage = `Network error: ${err.message}`;
      }
      
      dispatch(setError(errorMessage));
    }
  };

  // Memoize actions to avoid unnecessary rerenders
  const actions = useMemo(() => ({ sendUserMessage }), []);

  return (
    <ChatStateContext.Provider value={state}>
      <ChatActionContext.Provider value={actions}>
        {children}
      </ChatActionContext.Provider>
    </ChatStateContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export const useChatActions = () => {
  const context = useContext(ChatActionContext);
  if (!context) {
    throw new Error("useChatActions must be used within a ChatProvider");
  }
  return context;
};
