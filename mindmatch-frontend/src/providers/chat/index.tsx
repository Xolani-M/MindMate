
/**
 "use client";
import React, { useReducer, useContext, useMemo, useCallback, useEffect } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";
import { IChatMessage } from "./types";
import { ChatStateContext, ChatActionContext } from "./context";
import { sendMessage, receiveMessage, setLoading, setError } from "./actions";
import { chatReducer, initialChatState } from "./reducer";verview Chat Provider for MindMate chatbot functionality
 * @description Manages chat state and handles communication with the chatbot API
 * @author MindMate Development Team
 * @version 1.0.0
 */

"use client";
import React, { useReducer, useContext, useMemo, useCallback, useEffect } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";
import { IChatMessage } from "./types";
import { ChatStateContext, ChatActionContext } from "./context";
import { sendMessage, receiveMessage, setLoading, setError } from "./actions";
import { chatReducer, initialChatState } from "./reducer";

//#region Type Definitions

/**
 * Axios error type for better error handling
 */
interface IAxiosError {
  response: {
    status: number;
    data?: {
      error?: { message?: string };
      success?: boolean;
      result?: Record<string, unknown>;
    };
  };
  request?: Record<string, unknown>;
  message?: string;
}

//#endregion Type Definitions

//#region Utility Functions

/**
 * Chat storage key for localStorage
 */
const CHAT_STORAGE_KEY = 'mindmate_chat_history';

/**
 * Gets user-specific storage key
 */
const getUserChatStorageKey = (): string => {
  if (typeof window === 'undefined') return CHAT_STORAGE_KEY;
  
  // Try to get user identifier from sessionStorage (where auth token is stored)
  const authData = sessionStorage.getItem('authToken');
  if (authData) {
    try {
      // Create a simple hash of the token for user identification (without exposing the actual token)
      const userHash = btoa(authData).slice(0, 8);
      return `${CHAT_STORAGE_KEY}_${userHash}`;
    } catch {
      // Fallback to default key if hashing fails
    }
  }
  
  return CHAT_STORAGE_KEY;
};

/**
 * Loads chat history from localStorage for current user
 * 
 * @returns Saved chat messages or empty array
 */
const loadChatHistory = (): IChatMessage[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storageKey = getUserChatStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the data structure
      if (Array.isArray(parsed) && parsed.every(msg => 
        msg.id && msg.sender && msg.text && msg.createdAt
      )) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load chat history:', error);
  }
  
  return [];
};

/**
 * Saves chat history to localStorage for current user
 * 
 * @param messages - Chat messages to save
 */
const saveChatHistory = (messages: IChatMessage[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = getUserChatStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(messages));
  } catch (error) {
    console.warn('Failed to save chat history:', error);
  }
};

/**
 * Clears all chat history for all users (useful for logout)
 */
const clearAllChatHistory = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear current user's chat
    const currentKey = getUserChatStorageKey();
    localStorage.removeItem(currentKey);
    
    // Also clear the default key for backwards compatibility
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear chat history:', error);
  }
};

/**
 * Type guard to check if error is an Axios error
 * 
 * @param error - The error to check
 * @returns Whether the error is an Axios error
 */
const isAxiosError = (error: unknown): error is IAxiosError => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

/**
 * Processes API error and returns user-friendly message
 * 
 * @param err - The error object from the API call
 * @returns User-friendly error message
 */
const processApiError = (err: unknown): string => {
  if (isAxiosError(err)) {
    console.error('Response status:', err.response.status);
    console.error('Response data:', err.response.data);
    
    const { status, data } = err.response;
    
    switch (status) {
      case 500:
        if (data?.success === false && data?.error?.message) {
          return data.error.message.includes("internal error")
            ? "The chatbot service is experiencing technical difficulties. Our team has been notified. Please try again in a few moments."
            : `Chatbot service error: ${data.error.message}`;
        }
        return "The chatbot service is temporarily unavailable. Please try again later.";
      
      case 401:
        return "Your session has expired. Please log in again to use the chatbot.";
      
      case 400:
        return "Invalid message format. Please try a different message.";
      
      case 403:
        return "You don't have permission to access the chatbot. Please contact support.";
      
      default:
        return data?.error?.message || `Server error (${status}). Please try again.`;
    }
  }
  
  if (err instanceof Error) {
    console.error('Network error:', err.message);
    return `Connection error: ${err.message}. Please check your internet connection.`;
  }
  
  console.error('Unknown error:', err);
  return "An unexpected error occurred. Please try again.";
};

//#endregion Utility Functions

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state with saved chat history
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialChatState,
    messages: loadChatHistory()
  });

  // Track current user for auth changes
  const [currentUserToken, setCurrentUserToken] = React.useState<string | null>(null);

  // Initialize user token on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserToken(sessionStorage.getItem('token'));
    }
  }, []);

  // Monitor auth changes and clear chat on logout
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAuthChanges = () => {
      const token = sessionStorage.getItem('token');
      
      // If user was logged in but now has no token (logged out)
      if (currentUserToken && !token) {
        console.log('🧹 User logged out, clearing chat history');
        dispatch({ type: 'CLEAR_HISTORY' });
        clearAllChatHistory();
      }
      
      // Update current token reference
      setCurrentUserToken(token);
    };

    // Check auth changes periodically
    const interval = setInterval(checkAuthChanges, 1000);
    
    // Also check on storage events (for multi-tab logout)
    window.addEventListener('storage', checkAuthChanges);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuthChanges);
    };
  }, [currentUserToken]);

  // Save chat history whenever messages change
  React.useEffect(() => {
    saveChatHistory(state.messages);
  }, [state.messages]);

  //#region Event Handlers

  /**
   * Sends a user message to the chatbot and handles the response
   * 
   * @param text - The message text to send
   */
  const sendUserMessage = useCallback(async (text: string): Promise<void> => {
    // Create and dispatch user message
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
      // Force the correct format with explicit property name
      const requestPayload = {
        "Message": text.trim() // Ensure proper format and trim whitespace
      };
      
      console.log('🚀 Sending chat request with payload:', requestPayload);
      console.log('🚀 Request payload type:', typeof requestPayload.Message);
      console.log('🚀 Request payload stringified:', JSON.stringify(requestPayload));
      console.log('🚀 Object keys:', Object.keys(requestPayload));
      
      const res = await axiosInstance.post(
        "/api/services/app/Chat/GetChatbotReply",
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Chat API Response:', res.data);

      if (res.data.success && res.data.result?.reply) {
        const botMsg: IChatMessage = {
          id: uuidv4(),
          sender: "bot",
          text: res.data.result.reply,
          createdAt: new Date().toISOString(),
        };
        dispatch(receiveMessage(botMsg));
      } else {
        // Handle case where API returns success: false
        const errorMsg = res.data.error?.message || "Chatbot service returned an unexpected response.";
        dispatch(setError(errorMsg));
      }
      
    } catch (err: unknown) {
      console.error('Chat API Error Details:', err);
      const errorMessage = processApiError(err);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  /**
   * Clears the current error state
   */
  const clearError = useCallback((): void => {
    dispatch(setError());
  }, []);

  /**
   * Clears all chat history
   */
  const clearHistory = useCallback((): void => {
    dispatch({ type: 'CLEAR_HISTORY' });
    clearAllChatHistory();
  }, []);

  //#endregion Event Handlers

  // Memoize actions to avoid unnecessary rerenders
  const actions = useMemo(() => ({ 
    sendUserMessage, 
    clearError, 
    clearHistory 
  }), [sendUserMessage, clearError, clearHistory]);

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
