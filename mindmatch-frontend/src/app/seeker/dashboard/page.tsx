"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';
import { useAuthState } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import dashboardStyles from './dashboardstyles';
import SeekerNavBar from '@/components/SeekerNavBar';
import { ChatProvider, useChatState, useChatActions } from '@/providers/chat';
import { chatbotModalStyles } from '../chat/chatModalStyles';

interface ChatbotModalProps {
  readonly onClose: () => void;
}


function ChatbotModal({ onClose }: ChatbotModalProps) {
  const { messages, loading, error } = useChatState();
  const { sendUserMessage } = useChatActions() as { sendUserMessage: (text: string, seekerId: string) => Promise<void> };
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthState();
  const seekerId = user?.seekerId || null;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !seekerId) return;
    setSending(true);
    await sendUserMessage(input, seekerId);
    setInput('');
    setSending(false);
  };

  // Render modal in a portal, fixed at bottom right of viewport
  return typeof window !== 'undefined' ? createPortal(
    <div
      style={{
        ...chatbotModalStyles,
        position: 'fixed',
        right: 24,
        bottom: 24,
        left: 'unset',
        transform: 'none',
        width: 340,
        minHeight: 120,
        maxHeight: 340,
        borderRadius: 18,
        boxShadow: '0 8px 32px 0 rgba(99,102,241,0.16)',
        background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1.5px solid #e0e7ff',
        zIndex: 2001,
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div
        style={{
          padding: '18px 24px',
          borderBottom: '1.5px solid #e5e7eb',
          background: 'linear-gradient(90deg, #6366f1 60%, #818cf8 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 60,
          letterSpacing: 0.2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, marginRight: 8 }}>💬</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.2 }}>MindMate Chatbot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => router.push('/seeker/chat')}
            style={{
              background: 'white',
              color: '#6366f1',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              padding: '6px 16px',
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e7ef',
              transition: 'background 0.18s',
            }}
            aria-label="Open Full Chat"
            tabIndex={0}
            onMouseOver={e => (e.currentTarget.style.background = '#f1f5ff')}
            onMouseOut={e => (e.currentTarget.style.background = 'white')}
            onFocus={e => (e.currentTarget.style.background = '#f1f5ff')}
            onBlur={e => (e.currentTarget.style.background = 'white')}
          >
            Open Full Chat
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: 26,
              cursor: 'pointer',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85,
              transition: 'background 0.18s',
            }}
            aria-label="Close Chatbot"
            tabIndex={0}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
            onFocus={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onBlur={e => (e.currentTarget.style.background = 'none')}
          >
            &times;
          </button>
        </div>
      </div>
      {/* Messages */}
      <div style={{ flex: 1, minHeight: 0, padding: '18px 18px 8px 18px', overflowY: 'auto', background: 'transparent' }}>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: 14, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <span style={{
                display: 'inline-block',
                background: msg.sender === 'user' ? '#6366f1' : '#e0e7ff',
                color: msg.sender === 'user' ? 'white' : '#333',
                borderRadius: 12,
                padding: '10px 18px',
                maxWidth: '80%',
                fontSize: 15.5,
                boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(99,102,241,0.10)' : 'none',
                wordBreak: 'break-word',
              }}>{msg.text}</span>
            </div>
          ))
        ) : (
          <div style={{ color: '#888', fontSize: 15.5, textAlign: 'center', marginTop: 32 }}>Ask me anything about your wellness journey!</div>
        )}
        {loading && <div style={{ color: '#6366f1', fontSize: 15.5, marginTop: 8 }}>Thinking...</div>}
        {error && <div style={{ color: '#ef4444', fontSize: 15.5, marginTop: 8 }}>{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          padding: '14px 16px',
          borderTop: '1.5px solid #e5e7eb',
          background: 'rgba(255,255,255,0.98)',
          gap: 10,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{
            flex: 1,
            borderRadius: 12,
            border: '1.5px solid #c7d2fe',
            padding: '12px 16px',
            fontSize: 15.5,
            outline: 'none',
            boxShadow: '0 2px 8px rgba(99,102,241,0.05)',
            minWidth: 0,
            maxWidth: '100%',
            background: '#f8fafc',
            color: '#222',
          }}
          disabled={sending || !seekerId}
          aria-label="Chat input"
          inputMode="text"
        />
        <button
          type="submit"
          disabled={sending || !input.trim() || !seekerId}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '12px 22px',
            fontWeight: 700,
            fontSize: 15.5,
            cursor: sending || !input.trim() || !seekerId ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
            transition: 'background 0.2s',
            minWidth: 70,
          }}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>,
    document.body
  ) : null;
}



export default function DashboardPage() {
  const { seekerDashboard, seekerDashboardPending, seekerDashboardError } = useSeekerState();
  // Use the new getMyDashboard action (no seekerId needed)
  const { getMyDashboard } = useSeekerActions();
  const { user } = useAuthState();
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);

  // Debug logs
  console.log('DashboardPage user:', user);
  console.log('DashboardPage seekerDashboard:', seekerDashboard);

  // Helper for friendly fallback
  const friendly = (value: unknown, fallback = <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span>) => {
    if (value === null || value === undefined || value === '' || value === 'N/A') return fallback;
    return value as React.ReactNode;
  };

  let welcomeName = '';
  if (seekerDashboard) {
    const displayName = seekerDashboard.displayName;
    const name = seekerDashboard.name;
    welcomeName = displayName || name || 'Seeker';
  }

  useEffect(() => {
    console.log('useEffect user:', user);
    if (!user?.token) {
      router.push('/auth/login');
      return;
    }
    getMyDashboard();
  }, [user, getMyDashboard, router]);

  if (seekerDashboardPending) return (
    <div style={dashboardStyles.loading}>
      Loading your dashboard...
    </div>
  );
  if (seekerDashboardError) return (
    <div style={dashboardStyles.error}>
      {seekerDashboardError}
    </div>
  );
  if (!seekerDashboard) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
        <h2>Dashboard data not available</h2>
        <p>We couldn&rsquo;t load your dashboard data. Please check the console for debug info and try refreshing the page.</p>
        <pre style={{ textAlign: 'left', background: '#f3f4f6', padding: 16, borderRadius: 8, margin: '16px auto', maxWidth: 600, overflowX: 'auto' }}>
          user: {JSON.stringify(user, null, 2)}
          {'\n'}seekerDashboard: {JSON.stringify(seekerDashboard, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <ChatProvider>
      <SeekerNavBar />
      <div style={{
        ...dashboardStyles.container,
        minHeight: '100vh',
        padding: '0 0 220px 0', // Increased bottom padding to avoid chat modal overlap
        background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
      }}>
        <div style={dashboardStyles.orbTop} />
        <div style={dashboardStyles.orbBottom} />
        <main style={{
          ...dashboardStyles.main,
          maxWidth: 1400,
          margin: '0 auto',
          padding: '96px 0 96px 0',
        }}>
          <div style={{
            ...dashboardStyles.card,
            maxWidth: 1250,
            margin: 0, // Move card to the far left
            padding: '88px 88px 64px 88px',
            borderRadius: 48,
            boxShadow: '0 16px 64px rgba(99,102,241,0.14)',
            background: 'white',
            minHeight: 540,
            transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <h2 style={dashboardStyles.heading}>
              Welcome, {welcomeName}!
            </h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', justifyContent: 'center' }}>
              <button
                style={{
                  padding: '12px 28px',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.15)',
                  transition: 'all 0.2s',
                }}
                onClick={() => router.push('/seeker/assessment')}
              >
                Take Assessment
              </button>
              <button
                style={{
                  padding: '12px 28px',
                  background: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(20,184,166,0.15)',
                  transition: 'all 0.2s',
                }}
                onClick={() => router.push('/seeker/journal')}
              >
                Write Journal Entry
              </button>
            </div>
            <div style={dashboardStyles.subheading}>
              Here&rsquo;s a quick look at your wellness journey:
            </div>
            <div style={{
              ...dashboardStyles.grid,
              background: '#f3f4f6',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(99,102,241,0.07)',
              marginTop: 16,
              marginBottom: 8,
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 24,
              overflowX: 'auto',
              minWidth: 0,
            }}>
              <div style={{ ...dashboardStyles.gridItem, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e0e7ef' }}>
                <strong style={{ color: '#6366f1' }}>Latest Mood</strong><br />
                <span style={{ ...dashboardStyles.value, fontSize: 22 }}>{friendly(seekerDashboard.latestMood)}</span>
              </div>
              <div style={{ ...dashboardStyles.gridItem, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e0e7ef' }}>
                <strong style={{ color: '#6366f1' }}>Avg Mood (7d)</strong><br />
                <span style={{ ...dashboardStyles.value, fontSize: 22 }}>{friendly(seekerDashboard.averageMoodLast7Days)}</span>
              </div>
              <div style={{ ...dashboardStyles.gridItem, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e0e7ef' }}>
                <strong style={{ color: '#6366f1' }}>Risk Level</strong><br />
                <span style={{ ...dashboardStyles.value, fontSize: 22 }}>{friendly(seekerDashboard.riskLevel)}</span>
              </div>
              <div style={{ ...dashboardStyles.gridItem, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e0e7ef' }}>
                <strong style={{ color: '#6366f1' }}>Latest PHQ-9</strong><br />
                <span style={{ ...dashboardStyles.value, fontSize: 22 }}>{friendly(seekerDashboard.latestPhq9Score)}</span>
              </div>
              <div style={{ ...dashboardStyles.gridItem, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e0e7ef' }}>
                <strong style={{ color: '#6366f1' }}>Latest GAD-7</strong><br />
                <span style={{ ...dashboardStyles.value, fontSize: 22 }}>{friendly(seekerDashboard.latestGad7Score)}</span>
              </div>
              <div style={{ ...dashboardStyles.gridItem, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e0e7ef' }}>
                <strong style={{ color: '#6366f1' }}>Journal Entries</strong><br />
                <span style={{ ...dashboardStyles.value, fontSize: 22 }}>{friendly(seekerDashboard.totalJournalEntries)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
      {typeof window !== 'undefined' && createPortal(
        <>
          {!chatOpen && (
            <button
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                borderRadius: '50%',
                background: '#6366f1',
                color: 'white',
                width: 56,
                height: 56,
                boxShadow: '0 4px 20px rgba(99,102,241,0.2)',
                fontSize: 28,
                border: 'none',
                cursor: 'pointer',
                zIndex: 1000,
              }}
              onClick={() => setChatOpen(true)}
              aria-label="Open Chatbot"
            >
              💬
            </button>
          )}
          {chatOpen && <ChatbotModal onClose={() => setChatOpen(false)} />}
        </>,
        document.body
      )}
    </ChatProvider>
  );
}
