"use client";
import React from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { ChatProvider } from "@/providers/chat";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ChatPageComponent from "@/components/ChatPage";

function ChatPage() {
  const { isAuthenticated, isLoading, user } = useAuthGuard();

  // Show loading while session is being restored
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  // Show loading while checking authentication
  if (!isAuthenticated) {
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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <SeekerNavBar />
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatPageComponent 
          userToken={user?.token}
          userName={user?.name || user?.displayName}
        />
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
