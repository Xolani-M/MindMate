import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useAuthActions } from '@/providers/authProvider';

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

const logoutButtonStyles: React.CSSProperties = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 15,
  padding: '7px 18px',
  marginLeft: 16,
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(239, 68, 68, 0.3)',
  transition: 'all 0.18s',
};

export default function SeekerNavBar() {
  const router = useRouter();
  const { user } = useAuthState();
  const { logoutUser } = useAuthActions();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  useEffect(() => {
    if (!user?.token && !isLoggingOut) {
      router.push('/auth/login');
    }
  }, [user, router, isLoggingOut]);

  // Reset logout state when user changes (logout completes)
  useEffect(() => {
    if (!user?.token && isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [user, isLoggingOut]);

  // Add CSS for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Show friendly message briefly
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // The auth provider handles session clearing and redirect
    logoutUser();
  };

  return (
    <nav style={navBarStyles}>
      <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.2, textShadow: '0 1px 2px #4f46e5' }}>
        MindMate
      </span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/dashboard')}>Dashboard</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/chat')}>Chat</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/assessment')}>Assessment</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/journal')}>Journal</button>
        <button style={navButtonStyles} onClick={() => router.push('/seeker/profile')}>Profile</button>
        <button 
          style={{
            ...logoutButtonStyles,
            background: isLoggingOut ? '#f59e0b' : '#ef4444',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            minWidth: '80px'
          }} 
          onClick={handleLogout}
          disabled={isLoggingOut}
          onMouseEnter={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isLoggingOut ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Logging out...
            </span>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </nav>
  );
}
