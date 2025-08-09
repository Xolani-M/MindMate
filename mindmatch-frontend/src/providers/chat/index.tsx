
"use client";
import React, { useReducer, useContext, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";
import { IChatMessage } from "./types";
import { ChatStateContext, ChatActionContext } from "./context";
import { sendMessage, receiveMessage, setLoading, setError } from "./actions";
import { chatReducer, initialChatState } from "./reducer";


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
    dispatch(setError()); // Clear any previous errors
    try {
      const res = await axiosInstance.post(
          "/api/services/app/Chat/GetChatbotReply",
          { Message: text }
        );

      const botMsg: IChatMessage = {
        id: uuidv4(),
        sender: "bot",
        text: res.data.result.reply,
        createdAt: new Date().toISOString(),
      };
      dispatch(receiveMessage(botMsg));
      dispatch(setLoading(false));
    } catch (err: unknown) {
      console.error('Chat API Error:', err);
      
      let errorMessage = "Failed to get chatbot reply.";
      
      // Type guard for axios error
      const isAxiosError = (error: unknown): error is { 
        response: { 
          status: number; 
          data?: { error?: { message?: string }; success?: boolean } 
        } 
      } => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };
      
      if (isAxiosError(err)) {
        if (err.response.status === 500) {
          // Check if it's an ABP framework error
          if (err.response.data?.success === false && err.response.data?.error?.message) {
            errorMessage = `Chatbot service error: ${err.response.data.error.message}`;
          } else {
            errorMessage = "The chatbot service is temporarily unavailable. Please try again later.";
          }
        } else if (err.response.status === 401) {
          errorMessage = "Please log in again to use the chatbot.";
        } else if (err.response.status === 400) {
          errorMessage = "Invalid message format. Please try a different message.";
        } else if (err.response.data?.error?.message) {
          errorMessage = err.response.data.error.message;
        }
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err instanceof Error) {
        errorMessage = `Network error: ${err.message}`;
      }
      
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
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
