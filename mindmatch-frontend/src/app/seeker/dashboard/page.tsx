"use client";
import React, { useEffect, useState } from 'react';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';
import { useAuthState } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import dashboardStyles from './dashboardstyles';
import { getId } from '@/utils/jwt';
import { ChatProvider, useChatState, useChatActions } from '@/providers/chat';

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
  const seekerId = React.useMemo(() => user?.token ? getId(user.token) : null, [user]);

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

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: 370,
      maxWidth: '100vw',
      height: 500,
      background: '#fff',
      boxShadow: '0 4px 32px rgba(99,102,241,0.18)',
      borderRadius: '18px 18px 0 0',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#6366f1', color: 'white', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, marginRight: 6 }}>💬</span> MindMate Chatbot
        </span>
        <div>
          <button
            onClick={() => router.push('/seeker/chat')}
            style={{ background: 'white', color: '#6366f1', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, padding: '4px 12px', marginRight: 8, cursor: 'pointer', transition: 'background 0.2s' }}
            aria-label="Open Full Chat"
          >
            Open Full Chat
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer' }} aria-label="Close Chatbot">&times;</button>
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f8fafc' }}>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: 12, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <span style={{
                display: 'inline-block',
                background: msg.sender === 'user' ? '#6366f1' : '#e0e7ff',
                color: msg.sender === 'user' ? 'white' : '#333',
                borderRadius: 10,
                padding: '10px 16px',
                maxWidth: '80%',
                fontSize: 15,
                boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(99,102,241,0.10)' : 'none',
              }}>{msg.text}</span>
            </div>
          ))
        ) : (
          <div style={{ color: '#888', fontSize: 15 }}>Ask me anything about your wellness journey!</div>
        )}
        {loading && <div style={{ color: '#6366f1', fontSize: 15 }}>Thinking...</div>}
        {error && <div style={{ color: '#ef4444', fontSize: 15 }}>{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '14px', borderTop: '1px solid #eee', background: '#fff', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{ flex: 1, borderRadius: 10, border: '1px solid #ccc', padding: '10px 14px', fontSize: 15, outline: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.05)' }}
          disabled={sending || !seekerId}
          autoFocus
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={sending || !input.trim() || !seekerId}
          style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 15, cursor: sending || !input.trim() || !seekerId ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.10)', transition: 'background 0.2s' }}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}



export default function DashboardPage() {
  const { seekerDashboard, seekerDashboardPending, seekerDashboardError } = useSeekerState();
  const { getDashboard } = useSeekerActions();
  const { user } = useAuthState();
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);

  let welcomeName = '';
  if (seekerDashboard) {
    const displayName = seekerDashboard.displayName ?? 'N/A';
    const name = seekerDashboard.name ?? 'N/A';
    welcomeName = displayName !== 'N/A' ? displayName : name;
  }

  useEffect(() => {
    if (!user?.token) {
      router.push('/auth/login');
      return;
    }
    const seekerId = getId(user.token);
    getDashboard(seekerId);
  }, [user, getDashboard, router]);

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
  if (!seekerDashboard) return null;

  return (
    <ChatProvider>
      <div style={dashboardStyles.container}>
        <div style={dashboardStyles.orbTop} />
        <div style={dashboardStyles.orbBottom} />
        <main style={dashboardStyles.main}>
          <div style={dashboardStyles.card}>
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
              Here’s a quick look at your wellness journey:
            </div>
            <div style={dashboardStyles.grid}>
              <div style={dashboardStyles.gridItem}>
                <strong>Latest Mood:</strong><br />
                <span style={dashboardStyles.value}>{seekerDashboard.latestMood ?? 'N/A'}</span>
              </div>
              <div style={dashboardStyles.gridItem}>
                <strong>Avg Mood (7d):</strong><br />
                <span style={dashboardStyles.value}>{seekerDashboard.averageMoodLast7Days ?? 'N/A'}</span>
              </div>
              <div style={dashboardStyles.gridItem}>
                <strong>Risk Level:</strong><br />
                <span style={dashboardStyles.value}>{seekerDashboard.riskLevel ?? 'N/A'}</span>
              </div>
              <div style={dashboardStyles.gridItem}>
                <strong>Latest PHQ-9:</strong><br />
                <span style={dashboardStyles.value}>{seekerDashboard.latestPhq9Score ?? 'N/A'}</span>
              </div>
              <div style={dashboardStyles.gridItem}>
                <strong>Latest GAD-7:</strong><br />
                <span style={dashboardStyles.value}>{seekerDashboard.latestGad7Score ?? 'N/A'}</span>
              </div>
              <div style={dashboardStyles.gridItem}>
                <strong>Journal Entries:</strong><br />
                <span style={dashboardStyles.value}>{seekerDashboard.totalJournalEntries ?? 'N/A'}</span>
              </div>
            </div>
          </div>
        </main>
        {/* Floating Chat Button */}
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
        {chatOpen && <ChatbotModal onClose={() => setChatOpen(false)} />}
      </div>
    </ChatProvider>
  );
}
