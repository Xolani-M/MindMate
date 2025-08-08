
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
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
      dispatch(setError("Failed to get reply."));
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
