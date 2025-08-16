
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useAuthActions } from '@/providers/authProvider';
import styles from './SeekerNavBar.module.css';
import { Menu } from 'lucide-react';

export default function SeekerNavBar() {
  const router = useRouter();
  const { user } = useAuthState();
  const { logoutUser } = useAuthActions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    logoutUser();
  };

  const handleNav = (path: string) => {
    setMobileNavOpen(false);
    router.push(path);
  };

  // Close mobile nav on route change
  useEffect(() => {
    const close = () => setMobileNavOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);
    
  return (
    <nav className={styles.navBar}>
      <span className={styles.navBrand}>MindMate</span>
      <button className={styles.hamburger} aria-label="Open navigation" onClick={() => setMobileNavOpen(v => !v)}>
        <Menu />
      </button>
      <div className={styles.navLinks + (mobileNavOpen ? ' ' + styles.open : '')}>
        <button className={styles.navButton} onClick={() => handleNav('/seeker/dashboard')}>Dashboard</button>
        <button className={styles.navButton} onClick={() => handleNav('/seeker/analytics')}>Analytics</button>
        <button className={styles.navButton} onClick={() => handleNav('/seeker/chat')}>Chat</button>
        <button className={styles.navButton} onClick={() => handleNav('/seeker/assessment')}>Assessment</button>
        <button className={styles.navButton} onClick={() => handleNav('/seeker/journal')}>Journal</button>
        <button className={styles.navButton} onClick={() => handleNav('/seeker/profile')}>Profile</button>
        <button className={styles.logoutButton} onClick={handleLogout} disabled={isLoggingOut}>
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
