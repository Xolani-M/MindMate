/**
 * @fileoverview Enhanced Chat Modal Component
 * Modern, therapeutic design with cool icon alternatives to emojis
 * Follows MINDMATE coding standards with proper documentation
 */
"use client";

import React, { useState, useEffect } from 'react';
import { useChatState, useChatActions } from '@/providers/chat';
import { useAuthState } from '@/providers/authProvider';

// #region Interface Definitions
interface EnhancedChatModalProps {
  readonly onClose: () => void;
}

// #region Cool Icon Components (Emoji alternatives)
const IconComponents = {
  // Chat icon with animated gradient
  ChatIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path 
        d="M12 2 Q18 2 21 6 Q21 12 18 16 L16 18 L12 16 Q6 16 3 12 Q3 6 6 2 Q12 2 12 2 Z" 
        fill="url(#chatGrad)" 
        filter="url(#glow)"
      />
      <circle cx="8" cy="9" r="1.5" fill="white" />
      <circle cx="12" cy="9" r="1.5" fill="white" />
      <circle cx="16" cy="9" r="1.5" fill="white" />
    </svg>
  ),
  
  // Brain with neural network pattern
  BrainIcon: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path 
        d="M8 12 Q8 8 12 8 Q16 6 20 8 Q24 8 24 12 Q26 16 24 20 Q20 24 16 22 Q12 24 8 20 Q6 16 8 12 Z" 
        fill="url(#brainGrad)" 
      />
      <circle cx="11" cy="13" r="1" fill="white" opacity="0.8" />
      <circle cx="16" cy="11" r="1" fill="white" opacity="0.8" />
      <circle cx="21" cy="14" r="1" fill="white" opacity="0.8" />
      <path d="M11 13 L16 11 L21 14" stroke="white" strokeWidth="0.5" opacity="0.6" />
      <path d="M16 11 L16 17" stroke="white" strokeWidth="0.5" opacity="0.6" />
    </svg>
  ),
  
  // Sparkle effect for wellness
  SparkleIcon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path d="M10 2 L11 8 L10 14 L9 8 Z" fill="url(#sparkleGrad)" />
      <path d="M2 10 L8 9 L14 10 L8 11 Z" fill="url(#sparkleGrad)" />
      <circle cx="10" cy="10" r="2" fill="url(#sparkleGrad)" />
    </svg>
  ),
  
  // Send arrow with energy trail
  SendIcon: ({ isActive }: { isActive: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <defs>
        <linearGradient id="sendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isActive ? "#10b981" : "#9ca3af"} />
          <stop offset="100%" stopColor={isActive ? "#059669" : "#6b7280"} />
        </linearGradient>
      </defs>
      <path 
        d="M2 9 L16 9 M10 3 L16 9 L10 15" 
        stroke="url(#sendGrad)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {isActive && (
        <path 
          d="M1 9 L4 9" 
          stroke="url(#sendGrad)" 
          strokeWidth="1" 
          strokeLinecap="round" 
          opacity="0.6"
        />
      )}
    </svg>
  ),
  
  // Close icon with smooth animation
  CloseIcon: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M12 4 L4 12 M4 4 L12 12" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  ),
};
// #endregion

// #region Enhanced Chat Modal Component
export default function EnhancedChatModal({ onClose }: EnhancedChatModalProps) {
  const { messages, loading, error } = useChatState();
  const { sendUserMessage } = useChatActions() as { sendUserMessage: (text: string) => Promise<void> };
  const [input, setInput] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuthState();

  // #region Effects
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  // #endregion

  // #region Event Handlers
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !user?.token || loading) return;
    
    await sendUserMessage(input);
    setInput('');
  };

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);
  // #endregion

  // #region Modal Styles
  const modalStyles = {
    modal: {
      position: 'fixed' as const,
      right: 32,
      bottom: 32,
      width: 420,
      maxWidth: '90vw',
      minWidth: 350,
      height: '70vh',
      minHeight: 450,
      maxHeight: 650,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      boxShadow: '0 25px 80px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      border: '2px solid #e2e8f0',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
      padding: '24px',
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerText: {
      margin: 0,
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    headerSubtext: {
      margin: 0,
      fontSize: '0.85rem',
      opacity: 0.9,
      fontWeight: 400,
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '8px',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    messagesContainer: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto' as const,
      background: 'linear-gradient(180deg, #fafbff 0%, #f1f5f9 100%)',
    },
    emptyState: {
      textAlign: 'center' as const,
      color: '#64748b',
      padding: '40px 20px',
    },
    emptyStateText: {
      marginTop: '16px',
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    messageContainer: {
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'flex-start' as const,
    },
    userMessageContainer: {
      justifyContent: 'flex-end' as const,
    },
    message: {
      maxWidth: '85%',
      padding: '14px 18px',
      borderRadius: '18px',
      fontSize: '0.9rem',
      lineHeight: 1.5,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      wordBreak: 'break-word' as const,
    },
    userMessage: {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: 'white',
      borderBottomRightRadius: '6px',
    },
    assistantMessage: {
      background: 'white',
      color: '#374151',
      borderBottomLeftRadius: '6px',
      border: '1px solid #e5e7eb',
    },
    loadingMessage: {
      background: 'white',
      color: '#64748b',
      border: '1px solid #e5e7eb',
      borderBottomLeftRadius: '6px',
    },
    inputForm: {
      padding: '24px',
      background: 'white',
      borderTop: '1px solid #e5e7eb',
    },
    inputContainer: {
      display: 'flex',
      gap: '12px',
      background: '#f8fafc',
      padding: '8px',
      borderRadius: '16px',
      border: `2px solid ${isInputFocused ? '#6366f1' : '#e2e8f0'}`,
      transition: 'border-color 0.2s ease',
    },
    input: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      padding: '10px 14px',
      fontSize: '0.9rem',
      outline: 'none',
      color: '#374151',
      fontFamily: 'inherit',
    },
    sendButton: {
      background: input.trim() && !loading
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : '#e2e8f0',
      border: 'none',
      borderRadius: '12px',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s ease',
      transform: input.trim() && !loading ? 'scale(1)' : 'scale(0.95)',
    },
  };
  // #endregion

  return (
    <dialog open style={modalStyles.modal} aria-modal="true">
      {/* Enhanced Header */}
      <div style={modalStyles.header}>
        <div style={modalStyles.headerContent}>
          <IconComponents.ChatIcon />
          <div>
            <h3 style={modalStyles.headerText}>Wellness Assistant</h3>
            <p style={modalStyles.headerSubtext}>Here to support your journey</p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={modalStyles.closeButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close chat"
        >
          <IconComponents.CloseIcon />
        </button>
      </div>

      {/* Messages Area */}
      <div style={modalStyles.messagesContainer}>
        {messages.length === 0 && (
          <div style={modalStyles.emptyState}>
            <IconComponents.BrainIcon />
            <p style={modalStyles.emptyStateText}>
              Hello! I&apos;m your wellness companion.<br />
              How can I support you today? <IconComponents.SparkleIcon />
            </p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={msg.id || `message-${index}`}
            style={{
              ...modalStyles.messageContainer,
              ...(msg.sender === 'user' ? modalStyles.userMessageContainer : {}),
            }}
          >
            <div
              style={{
                ...modalStyles.message,
                ...(msg.sender === 'user' ? modalStyles.userMessage : modalStyles.assistantMessage),
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={modalStyles.messageContainer}>
            <div style={{ ...modalStyles.message, ...modalStyles.loadingMessage }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconComponents.BrainIcon />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div style={modalStyles.messageContainer}>
            <div style={{
              ...modalStyles.message,
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <form onSubmit={handleSend} style={modalStyles.inputForm}>
        <div style={modalStyles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Share what's on your mind..."
            style={modalStyles.input}
            disabled={loading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={modalStyles.sendButton}
            onMouseEnter={(e) => {
              if (input.trim() && !loading) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = input.trim() && !loading ? 'scale(1)' : 'scale(0.95)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Send message"
          >
            <IconComponents.SendIcon isActive={!!input.trim() && !loading} />
          </button>
        </div>
      </form>
    </dialog>
  );
}
// #endregion
