import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useAuthActions } from '@/providers/authProvider';

const navBarStyles: React.CSSProperties = {
  width: '100%',
  background: '#4f46e5',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  height: 64,
  boxShadow: '0 4px 20px rgba(79, 70, 229, 0.25)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
};

const navButtonStyles: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 14,
  padding: '10px 20px',
  marginLeft: 12,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(10px)',
};

const logoutButtonStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 14,
  padding: '10px 20px',
  marginLeft: 16,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(10px)',
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
      <span style={{ 
        fontWeight: 700, 
        fontSize: 20, 
        letterSpacing: 0.5,
        background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 8px rgba(255, 255, 255, 0.3)',
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
      }}>
        MindMate
      </span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          style={navButtonStyles} 
          onClick={() => router.push('/seeker/dashboard')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          Dashboard
        </button>
        <button 
          style={navButtonStyles} 
          onClick={() => router.push('/seeker/chat')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          Chat
        </button>
        <button 
          style={navButtonStyles} 
          onClick={() => router.push('/seeker/assessment')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          Assessment
        </button>
        <button 
          style={navButtonStyles} 
          onClick={() => router.push('/seeker/journal')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          Journal
        </button>
        <button 
          style={navButtonStyles} 
          onClick={() => router.push('/seeker/profile')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          Profile
        </button>
        <button 
          style={{
            ...logoutButtonStyles,
            background: isLoggingOut ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            minWidth: '100px'
          }} 
          onClick={handleLogout}
          disabled={isLoggingOut}
          onMouseEnter={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
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
