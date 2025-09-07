
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertCircle, Mic, Volume2, VolumeX, Waves, Phone, PhoneOff } from 'lucide-react';
import { useChatState, useChatActions } from "@/providers/chat";
import styles from './ChatWidget.module.css';

interface ChatWidgetProps {
  className?: string;
}

const ChatWidget = ({ className }: ChatWidgetProps) => {
  const { messages, readyState, loading, error, isListening, isMuted } = useChatState();
  const { connect, disconnect, sendMessage, toggleListening, muteAudio } = useChatActions();
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
    if (!inputValue.trim() || loading || readyState !== "OPEN") return;
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleMute = () => {
    muteAudio();
  };

  const handleToggleListening = () => {
    toggleListening();
  };

  const getConnectionStatus = () => {
    switch (readyState) {
      case 'OPEN': return { text: 'Connected', color: '#10b981', icon: Phone };
      case 'CONNECTING': return { text: 'Connecting...', color: '#f59e0b', icon: Phone };
      default: return { text: 'Disconnected', color: '#ef4444', icon: PhoneOff };
    }
  };

  const connectionStatus = getConnectionStatus();

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
              <div className={styles.headerAvatar}>
                <Bot size={16} />
              </div>
              <div className={styles.headerInfo}>
                <h3 className={styles.headerTitle}>MindMate Assistant</h3>
                <div className={styles.headerStatus}>
                  <connectionStatus.icon size={12} />
                  <span style={{ color: connectionStatus.color }}>{connectionStatus.text}</span>
                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={`${styles.headerButton} ${isMuted ? styles.headerButtonActive : ''}`}
                onClick={handleToggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button 
                className={styles.closeButton}
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
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
            {messages.map((msg, idx) => (
              <div 
                key={msg.id || idx}
                className={styles.message}
              >
                <div className={styles.messageAvatar}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={styles.messageBubble}>
                  {msg.text}
                  {msg.audioData && (
                    <div className={styles.audioPlayer}>
                      <audio controls preload="metadata">
                        <source src={msg.audioData} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className={styles.message}>
                <div className={styles.messageAvatar}>
                  <Bot size={14} />
                </div>
                <div className={styles.messageBubble}>
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
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              {isListening && (
                <div className={styles.voiceIndicator}>
                  <div className={styles.voiceWaves}>
                    <div className={styles.voiceWave}></div>
                    <div className={styles.voiceWave}></div>
                    <div className={styles.voiceWave}></div>
                  </div>
                </div>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className={styles.messageInput}
                disabled={loading || readyState !== "OPEN" || isListening}
                maxLength={500}
              />
              <div className={styles.inputActions}>
                <button
                  type="button"
                  className={`${styles.micButton} ${isListening ? styles.micButtonActive : ''}`}
                  onClick={handleToggleListening}
                  disabled={readyState !== 'OPEN'}
                  title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                  {isListening ? <Waves size={14} /> : <Mic size={14} />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading || readyState !== "OPEN" || isListening}
                  className={styles.sendButton}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
            
            {/* Session Controls */}
            <div className={styles.sessionControls}>
              {readyState === "OPEN" ? (
                <button onClick={disconnect} className={styles.disconnectButton}>
                  <PhoneOff size={12} />
                  End Session
                </button>
              ) : (
                <button onClick={() => connect()} className={styles.connectButton}>
                  <Phone size={12} />
                  Start Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
