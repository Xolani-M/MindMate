"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Heart, Shield, Sparkles, MessageCircle } from 'lucide-react';
import styles from './ChatPage.module.css';
import { useChatState, useChatActions } from "@/providers/chat";
import { EnhancedChatError } from "@/components/EnhancedChatError";

interface ChatPageProps {
  userToken?: string;
  userName?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userToken, userName }) => {
  const { messages, loading, error } = useChatState();
  const { sendUserMessage, clearError } = useChatActions();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userToken) return;
    
    setSending(true);
    await sendUserMessage(input);
    setInput("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const quickPrompts = [
    { icon: Heart, text: "How are you feeling today?", color: "#ef4444" },
    { icon: Sparkles, text: "I need some motivation", color: "#f59e0b" },
    { icon: Shield, text: "Help me manage stress", color: "#10b981" },
    { icon: MessageCircle, text: "I want to talk about something", color: "#6366f1" }
  ];

  return (
    <div className={styles.chatContainer}>
      {/* Messages Area */}
      <div className={styles.messagesContainer}>
        {/* Welcome Message */}
        {(!messages || messages.length === 0) && (
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeAvatar}>
              <Bot size={32} />
            </div>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>
                {userName ? `Hi ${userName}, welcome to ` : "Welcome to "}your MindMate Assistant
              </h2>
              <p className={styles.welcomeText}>
                I&apos;m here to listen, support, and help you on your mental wellness journey. 
                Everything you share is confidential and judgment-free.
              </p>
              <div className={styles.quickPrompts}>
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    className={styles.quickPrompt}
                    onClick={() => setInput(prompt.text)}
                    style={{ borderColor: prompt.color }}
                  >
                    <prompt.icon size={16} style={{ color: prompt.color }} />
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className={styles.messagesList}>
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender === "user" ? styles.messageUser : styles.messageBot
              }`}
            >
              <div className={styles.messageAvatar}>
                {msg.sender === "user" ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  {msg.text}
                </div>
                <div className={styles.messageTime}>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {(loading || sending) && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <div className={styles.messageAvatar}>
                <Bot size={16} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span>MindMate is thinking</span>
                  <div className={styles.typingDots}>
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className={styles.errorContainer}>
              <EnhancedChatError 
                error={error}
                onRetry={() => {
                  const lastUserMessage = messages?.findLast(msg => msg.sender === 'user');
                  if (lastUserMessage) {
                    sendUserMessage(lastUserMessage.text);
                  }
                }}
                onClear={clearError}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className={styles.inputContainer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className={styles.messageInput}
              disabled={sending || !userToken}
            />
            <button
              type="submit"
              disabled={sending || !input.trim() || !userToken}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>

        {/* Input Helper Text */}
        <div className={styles.inputHelper}>
          <div className={styles.helperText}>
            <Shield size={12} />
            <span>Your conversations are private and secure</span>
          </div>
          <div className={styles.helperActions}>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
