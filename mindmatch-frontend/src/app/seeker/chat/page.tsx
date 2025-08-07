"use client";
import React, { useState } from "react";
import { ChatProvider, useChatState, useChatActions } from "@/providers/chat";
import { useAuthState } from "@/providers/authProvider";
import { getId } from "@/utils/jwt";

function ChatPage() {
  const { messages, loading, error } = useChatState();
  const { sendUserMessage } = useChatActions() as { sendUserMessage: (text: string, seekerId: string) => Promise<void> };
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuthState();
  const seekerId = user?.token ? getId(user.token) : null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !seekerId) return;
    setSending(true);
    await sendUserMessage(input, seekerId);
    setInput("");
    setSending(false);
  };

  return (
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
        maxWidth: 480,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 32px rgba(99,102,241,0.15)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "20px 24px",
          background: "#6366f1",
          color: "white",
          fontWeight: 600,
          fontSize: "1.2rem",
          borderRadius: "16px 16px 0 0",
        }}>
          MindMate Chatbot
          {seekerId && (
            <span style={{ marginLeft: 12, fontSize: 13, color: '#e0e7ff', fontWeight: 400 }}>
              (Seeker ID: {seekerId})
            </span>
          )}
        </div>
        <div style={{ flex: 1, padding: "24px", overflowY: "auto", background: "#f8fafc", minHeight: 320 }}>
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: 16, textAlign: msg.sender === "user" ? "right" : "left" }}>
                <span style={{
                  display: "inline-block",
                  background: msg.sender === "user" ? "#6366f1" : "#e0e7ff",
                  color: msg.sender === "user" ? "white" : "#333",
                  borderRadius: 8,
                  padding: "10px 16px",
                  maxWidth: "80%",
                  fontSize: 16,
                }}>{msg.text}</span>
              </div>
            ))
          ) : (
            <div style={{ color: "#888", fontSize: 16 }}>Ask me anything about your wellness journey!</div>
          )}
          {loading && <div style={{ color: "#6366f1", fontSize: 16 }}>Thinking...</div>}
          {error && <div style={{ color: "#ef4444", fontSize: 16 }}>{error}</div>}
        </div>
        <form onSubmit={handleSend} style={{ display: "flex", padding: "16px", borderTop: "1px solid #eee", background: "#fff" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: "10px 16px", fontSize: 16 }}
            disabled={sending || !seekerId}
          />
          <button
            type="submit"
            disabled={sending || !input.trim() || !seekerId}
            style={{ marginLeft: 10, background: "#6366f1", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPageWrapper() {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}
