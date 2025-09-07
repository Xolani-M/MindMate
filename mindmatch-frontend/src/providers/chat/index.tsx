

"use client";
import React, { useContext, useMemo, useCallback, useState, useEffect } from "react";
import { VoiceProvider, useVoice } from "@humeai/voice-react";
import { v4 as uuidv4 } from "uuid";
import { IChatMessage } from "./types";
import { ModernLoadingState } from "@/components/LoadingStates/LoadingStates";
import { ChatStateContext, ChatActionContext, ChatProviderContext } from "./context";
import { axiosInstance } from "@/utils/axiosInstance";
/**
 * Chat Provider for MindMate chatbot functionality
 * @description Manages chat state and handles communication with the chatbot API
 * @author MindMate Development Team
 * @version 1.0.0
 */

//#region Type Definitions

/**
 * Axios error type for better error handling
 */

//endregion Type Definitions

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
  } catch {
    // Optionally log to external service or ignore for production
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
  } catch {
    // Optionally log to external service or ignore for production
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
  } catch {
    // Optionally log to external service or ignore for production
  }
};

/**
 * Type guard to check if error is an Axios error
 * 
 * @param error - The error to check
 * @returns Whether the error is an Axios error
 */


/**
 * Processes API error and returns user-friendly message
 * 
 * @param err - The error object from the API call
 * @returns User-friendly error message
 */


//#endregion Utility Functions

const InnerChatProvider = ({ children, accessToken }: { children: React.ReactNode; accessToken: string }) => {
  const { 
    messages: voiceMessages, 
    connect, 
    disconnect, 
    status,
    sendUserInput,
    error: voiceError,
    isMuted,
    isPlaying,
    mute,
    unmute
  } = useVoice();
  
  const [messages, setMessages] = useState<IChatMessage[]>(loadChatHistory());
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);


  // Convert Hume voice messages to our chat format
  useEffect(() => {
    const chatMessages: IChatMessage[] = voiceMessages
      .filter(msg => msg.type === 'user_message' || msg.type === 'assistant_message')
      .map(msg => {
        let text = '';
        if ('message' in msg && msg.message) {
          if (typeof msg.message === 'string') {
            text = msg.message;
          } else if (typeof msg.message === 'object' && 'content' in msg.message) {
            text = msg.message.content || '';
          }
        }
        
        let audioData = undefined;
        if (msg.type === 'assistant_message' && 'audio' in msg && msg.audio) {
          if (typeof msg.audio === 'object' && 'url' in msg.audio && typeof msg.audio.url === 'string') {
            audioData = msg.audio.url;
          } else if (typeof msg.audio === 'string') {
            audioData = msg.audio;
          }
        }
        
        return {
          id: uuidv4(),
          sender: msg.type === 'user_message' ? 'user' : 'bot',
          text: text,
          createdAt: new Date().toISOString(),
          audioData: audioData
        };
      });
    
    setMessages(chatMessages);
    saveChatHistory(chatMessages);
  }, [voiceMessages]);

  // Handle voice errors
  useEffect(() => {
    if (voiceError) {
      setError(voiceError.message || 'Voice connection error');
    }
  }, [voiceError]);

  const sendMessage = useCallback(async (text: string) => {
    if (status.value === 'connected') {
      sendUserInput(text);
    }
  }, [sendUserInput, status]);

  const sendVoiceMessage = useCallback(async () => {
    // Hume SDK handles audio automatically, this is for compatibility
    console.log('Voice message sending is handled automatically by Hume SDK');
  }, []);

  const startListening = useCallback(async () => {
    // Voice recording is handled automatically by Hume SDK
    setIsListening(true);
  }, []);

  const stopListening = useCallback(async () => {
    // Voice recording is handled automatically by Hume SDK
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  const muteAudio = useCallback(() => {
    if (isMuted && unmute) {
      unmute();
    } else if (!isMuted && mute) {
      mute();
    }
  }, [isMuted, mute, unmute]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    clearAllChatHistory();
  }, []);

  const connectWrapper = useCallback(async () => {
    await connect({
      auth: {
        type: "accessToken",
        value: accessToken,
      }
    });
  }, [connect, accessToken]);

  const disconnectWrapper = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  const actions = useMemo(() => ({
    connect: connectWrapper,
    disconnect: disconnectWrapper,
    sendMessage,
    sendVoiceMessage,
    startListening,
    stopListening,
    toggleListening,
    muteAudio,
    clearError,
    clearHistory,
  }), [connectWrapper, disconnectWrapper, sendMessage, sendVoiceMessage, startListening, stopListening, toggleListening, muteAudio, clearError, clearHistory]);

  const chatState = useMemo(() => ({
    messages,
    loading: status.value === 'connecting',
    error: error || voiceError?.message,
    readyState: status.value === 'connected' ? 'OPEN' as const : 
                status.value === 'connecting' ? 'CONNECTING' as const : 'CLOSED' as const,
    isListening,
    isMuted: isMuted || false,
    isPlaying: isPlaying || false,
  }), [messages, status, error, voiceError, isListening, isMuted, isPlaying]);

  return (
    <ChatStateContext.Provider value={chatState}>
      <ChatActionContext.Provider value={actions}>
        {children}
      </ChatActionContext.Provider>
    </ChatStateContext.Provider>
  );
};

export const ChatProvider = ({ children, skipLoadingUI = false }: { children: React.ReactNode; skipLoadingUI?: boolean }) => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await axiosInstance.post('/api/services/app/EmpathicVoiceService/GenerateAccessToken');
        const token = response.data;
        
        // If the backend returns an object with a result property (ABP pattern)
        let finalToken = token;
        if (typeof token === 'object' && token.result) {
          finalToken = token.result;
        }
        
        // If it's still an object, try to get the access_token property
        if (typeof finalToken === 'object' && finalToken.access_token) {
          finalToken = finalToken.access_token;
        }
        
        setAccessToken(finalToken);
      } catch (err) {
        console.error('Failed to get access token:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    getAccessToken();
  }, []);

  if (!accessToken) {
    if (skipLoadingUI) {
      // Return null to let parent component handle loading UI
      return null;
    }
    return <ModernLoadingState type="general" message="Initializing MindMate..." />;
  }

  return (
    <ChatProviderContext.Provider value={{ isInitializing }}>
      <VoiceProvider 
        onMessage={(message) => {
          // Handle real-time messages if needed
        }}
      >
        <InnerChatProvider accessToken={accessToken}>{children}</InnerChatProvider>
      </VoiceProvider>
    </ChatProviderContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
// Remove extra closing brace
}

export const useChatActions = () => {
  const context = useContext(ChatActionContext);
  if (!context) {
    throw new Error("useChatActions must be used within a ChatProvider");
  }
  return context;
}

export const useChatProvider = () => {
  const context = useContext(ChatProviderContext);
  return context;
}
