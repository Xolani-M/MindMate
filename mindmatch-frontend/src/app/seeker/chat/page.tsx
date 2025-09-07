"use client";
import React from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { ChatProvider } from "@/providers/chat";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ChatPageComponent from "@/components/ChatPage";

function ChatPage() {
  const { isAuthenticated, isLoading, user } = useAuthGuard();

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }

  // Show nothing while loading, let ChatProvider handle the loading state
  if (isLoading) {
    return null;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <SeekerNavBar />
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatPageComponent 
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
