"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Mic, MicOff, Volume2, VolumeX, Waves, Phone, PhoneOff } from 'lucide-react';
import styles from './ChatPage.module.css';
import { useChatState, useChatActions } from "@/providers/chat";


interface ChatPageProps {
  userName?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userName }) => {
  const { messages, readyState, loading, error, isListening, isMuted } = useChatState();
  const { connect, disconnect, sendMessage, toggleListening, muteAudio } = useChatActions();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // ...existing code...

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || readyState !== "OPEN") return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
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
    <div className={styles.chatContainer}>
      {/* Professional Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>
            <Bot size={24} className={styles.headerIcon} />
            <div>
              <h1 className={styles.headerMainTitle}>MindMate Assistant</h1>
              <p className={styles.headerSubtitle}>Empathic AI for Mental Wellness</p>
            </div>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.connectionStatus}>
            <connectionStatus.icon size={16} />
            <span style={{ color: connectionStatus.color }}>{connectionStatus.text}</span>
          </div>
          
          <div className={styles.voiceControls}>
            <button 
              className={`${styles.voiceButton} ${isMuted ? styles.voiceButtonActive : ''}`}
              onClick={handleToggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            
            <button 
              className={`${styles.voiceButton} ${isListening ? styles.voiceButtonActive : ''}`}
              onClick={handleToggleListening}
              title={isListening ? "Stop Listening" : "Start Listening"}
              disabled={readyState !== 'OPEN'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          
          <div className={styles.sessionActions}>
            {readyState === "OPEN" ? (
              <button onClick={disconnect} className={styles.disconnectButton}>
                <PhoneOff size={16} />
                End Session
              </button>
            ) : (
              <button onClick={() => connect()} className={styles.connectButton}>
                <Phone size={16} />
                Start Session
              </button>
            )}
          </div>
        </div>
      </div>
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
              {/* ...quick prompts logic unchanged... */}
            </div>
          </div>
        )}
        {/* Chat Messages */}
        <div className={styles.messagesList}>
          {messages?.map((msg, idx) => (
            <div key={msg.id || idx} className={styles.message}>
              <div className={styles.messageAvatar}>
                {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={styles.messageContent}>
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
            </div>
          ))}
          {/* Typing Indicator */}
          {loading && (
            <div className={styles.message}>
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
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input Area */}
      <div className={styles.inputContainer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
            {isListening && (
              <div className={styles.voiceIndicator}>
                <div className={styles.voiceWaves}>
                  <div className={styles.voiceWave}></div>
                  <div className={styles.voiceWave}></div>
                  <div className={styles.voiceWave}></div>
                </div>
                <span className={styles.voiceIndicatorText}>Listening...</span>
              </div>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "I'm listening to your voice..." : "Share what's on your mind..."}
              className={styles.messageInput}
              disabled={loading || readyState !== "OPEN" || isListening}
            />
            <div className={styles.inputActions}>
              <button
                type="button"
                className={`${styles.micButton} ${isListening ? styles.micButtonActive : ''}`}
                onClick={handleToggleListening}
                disabled={readyState !== 'OPEN'}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <Waves size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || loading || readyState !== "OPEN" || isListening}
                className={styles.sendButton}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>
        
        <div className={styles.inputHelper}>
          <div className={styles.helperText}>
            {readyState === 'OPEN' ? (
              <>
                <div className={styles.statusIndicator} />
                Connected - Voice & text ready
              </>
            ) : (
              <span>Start a session to begin chatting</span>
            )}
          </div>
          <div className={styles.helperActions}>
            Press Enter to send
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
