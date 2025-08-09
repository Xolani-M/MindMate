"use client";
import React, { useState, useEffect } from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { ChatProvider, useChatState, useChatActions } from "@/providers/chat";
import { EnhancedChatError } from "@/components/EnhancedChatError";
import { useAuthState } from "@/providers/authProvider";
import { useRouter } from 'next/navigation';

function ChatPage() {
  const { messages, loading, error } = useChatState();
  const { sendUserMessage, clearError } = useChatActions();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { user, isSuccess } = useAuthState();
  const router = useRouter();
  const seekerName = user?.name || user?.displayName || null;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.token && isSuccess === false) {
      console.log('No valid authentication, redirecting to login');
      router.push('/auth/login');
    }
  }, [user?.token, isSuccess, router]);

  // Show loading while checking authentication
  if (!user?.token) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          color: "#6366f1",
          fontSize: "16px",
          fontWeight: 500,
        }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?.token) return; // Check for valid user token instead of seekerId
    setSending(true);
    await sendUserMessage(input);
    setInput("");
    setSending(false);
  };

  return (
    <>
      <SeekerNavBar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 900,
          minHeight: 700,
          background: "#fff",
          borderRadius: 36,
          boxShadow: "0 8px 48px rgba(99,102,241,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "2px solid #e0e7ff",
        }}>
          {/* Chatbot-style header with original colors */}
          <div style={{
            padding: "32px 40px 24px 40px",
            background: "linear-gradient(90deg, #6366f1 60%, #818cf8 100%)",
            color: "white",
            fontWeight: 700,
            fontSize: "1.6rem",
            borderRadius: "36px 36px 0 0",
            display: "flex",
            alignItems: "center",
            minHeight: 80,
            letterSpacing: 0.2,
          }}>
            <span style={{ fontSize: 28, marginRight: 14 }}>💬</span>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 0.2 }}>MindMate Chatbot</span>
            {seekerName && (
              <span style={{ marginLeft: 18, fontSize: 15, color: '#e0e7ff', fontWeight: 400 }}>
                ({seekerName})
              </span>
            )}
          </div>
          {/* Chatbot-style chat area with message bubbles */}
          <div style={{
            flex: 1,
            padding: "36px 40px 24px 40px",
            overflowY: "auto",
            background: "#f8fafc",
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: 16,
                }}>
                  <span style={{
                    background: msg.sender === "user" ? "#6366f1" : "#e0e7ff",
                    color: msg.sender === "user" ? "#fff" : "#333",
                    borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "14px 22px",
                    maxWidth: "70%",
                    fontSize: 17,
                    boxShadow: msg.sender === "user" ? "0 2px 8px rgba(99,102,241,0.10)" : "0 1px 4px #e0e7ef",
                    wordBreak: "break-word",
                    marginLeft: msg.sender === "user" ? 40 : 0,
                    marginRight: msg.sender === "user" ? 0 : 40,
                  }}>{msg.text}</span>
                </div>
              ))
            ) : (
              <div style={{ color: "#888", fontSize: 17, textAlign: "center", marginTop: 32 }}>Ask me anything about your wellness journey!</div>
            )}
            {loading && <div style={{ color: "#6366f1", fontSize: 17, marginTop: 8 }}>Thinking...</div>}
            {error && (
              <div style={{ marginTop: 16, padding: '0 4px' }}>
                <EnhancedChatError 
                  error={error}
                  onRetry={() => {
                    // Get the last user message and resend it
                    const lastUserMessage = messages?.findLast(msg => msg.sender === 'user');
                    if (lastUserMessage) {
                      sendUserMessage(lastUserMessage.text);
                    }
                  }}
                  onClear={clearError}
                />
              </div>
            )}
          </div>
          {/* Chatbot-style input bar, button unchanged */}
          <form onSubmit={handleSend} style={{
            display: "flex",
            alignItems: "center",
            padding: "18px 36px 28px 36px",
            borderTop: "1.5px solid #e0e7ff",
            background: "#fff",
            gap: 12,
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              style={{
                flex: 1,
                borderRadius: 16,
                border: "1.5px solid #c7d2fe",
                padding: "16px 22px",
                fontSize: 17,
                outline: "none",
                background: "#f8fafc",
                color: "#222",
                boxShadow: "0 2px 8px rgba(99,102,241,0.05)",
                minWidth: 0,
                maxWidth: "100%",
              }}
              disabled={sending || !user?.token}
            />
            <button
              type="submit"
              disabled={sending || !input.trim() || !user?.token}
              style={{ marginLeft: 10, background: "#6366f1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function ChatPageWrapper() {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}
