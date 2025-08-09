'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';
import { useChatState, useChatActions } from '@/providers/chat';
import styles from './ChatWidget.module.css';

interface ChatWidgetProps {
  className?: string;
}

const ChatWidget = ({ className }: ChatWidgetProps) => {
  const { messages, loading, error } = useChatState();
  const { sendUserMessage, clearError } = useChatActions();
  
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    try {
      await sendUserMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (error) {
      clearError();
    }
  };

  return (
    <div className={`${styles.chatContainer} ${className || ''}`}>
      {/* Chat Button */}
      <button
        className={styles.chatButton}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        {messages.length > 0 && (
          <span className={styles.notificationBadge}>
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <Bot size={20} />
              <div>
                <h3>MindMate Assistant</h3>
                <p>Here to support your wellness</p>
              </div>
            </div>
            <button 
              className={styles.closeButton}
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <Bot size={32} className={styles.welcomeIcon} />
                <p>Hi! I&apos;m your MindMate AI assistant. How can I support your wellness journey today?</p>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`${styles.message} ${
                  message.sender === 'bot' ? styles.messageBot : styles.messageUser
                }`}
              >
                <div className={`${styles.messageAvatar} ${
                  message.sender === 'bot' ? styles.messageAvatarBot : styles.messageAvatarUser
                }`}>
                  {message.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className={`${styles.messageBubble} ${
                  message.sender === 'bot' ? styles.messageBubbleBot : styles.messageBubbleUser
                }`}>
                  {message.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className={`${styles.message} ${styles.messageBot}`}>
                <div className={`${styles.messageAvatar} ${styles.messageAvatarBot}`}>
                  <Bot size={14} />
                </div>
                <div className={`${styles.messageBubble} ${styles.messageBubbleBot} ${styles.loadingBubble}`}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                <span>{error}</span>
                <button onClick={clearError} className={styles.errorDismiss}>
                  <X size={14} />
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share what's on your mind..."
              className={styles.messageInput}
              disabled={loading}
              maxLength={500}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
