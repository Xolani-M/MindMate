import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/providers/authProvider';

const navBarStyles: React.CSSProperties = {
  width: '100%',
  background: '#6366f1',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  height: 56,
  boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const navButtonStyles: React.CSSProperties = {
  background: 'white',
  color: '#6366f1',
  border: 'none',
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 15,
  padding: '7px 18px',
  marginLeft: 12,
  cursor: 'pointer',
  boxShadow: '0 1px 4px #e0e7ef',
  transition: 'background 0.18s',
};

export default function SeekerNavBar() {
  const router = useRouter();
  const { user } = useAuthState();

  useEffect(() => {
    if (!user?.token) {
      router.push('/auth/login');
    }
  }, [user, router]);

  return (
    <nav style={navBarStyles}>
      <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.2, textShadow: '0 1px 2px #4f46e5' }}>MindMate</span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/dashboard')}>Dashboard</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/chat')}>Chat</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/assessment')}>Assessment</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/journal')}>Journal</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/profile')}>Profile</button>
      </div>
    </nav>
  );
}
