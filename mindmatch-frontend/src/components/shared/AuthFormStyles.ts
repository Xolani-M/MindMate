// Shared styles for authentication forms (login/signup)
import { CSSProperties } from 'react';

interface AuthFormStyles {
  container: CSSProperties;
  orbTop: CSSProperties;
  orbBottom: CSSProperties;
  card: CSSProperties;
  emoji: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  divider: CSSProperties;
  formInput: CSSProperties;
  formRow: CSSProperties;
  formItemHalf: CSSProperties;
  rememberRow: CSSProperties;
  link: CSSProperties;
  centerText: CSSProperties;
  backHome: CSSProperties;
  errorMessage: CSSProperties;
  successMessage: CSSProperties;
  checkbox: CSSProperties;
}

export const authFormStyles: AuthFormStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 'clamp(12px, 4vw, 20px)',
    overflowY: 'auto' as const,
  },
  
  orbTop: {
    position: 'absolute' as const,
    top: '10%',
    right: '10%',
    width: 'clamp(150px, 25vw, 300px)',
    height: 'clamp(150px, 25vw, 300px)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: 0.6,
  },
  
  orbBottom: {
    position: 'absolute' as const,
    bottom: '20%',
    left: '5%',
    width: 'clamp(100px, 20vw, 200px)',
    height: 'clamp(100px, 20vw, 200px)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.8,
  },
  
  card: {
    maxWidth: '500px',
    width: '100%',
    padding: 'clamp(16px, 5vw, 32px)',
    margin: '0 auto',
    boxSizing: 'border-box' as const,
    minHeight: 'unset' as const,
    borderRadius: 'clamp(12px, 2vw, 20px)',
  },
  
  emoji: {
    fontSize: 'clamp(30px, 8vw, 50px)',
    marginBottom: '15px',
  },
  
  title: {
    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
    margin: 0,
    marginBottom: '10px',
    lineHeight: 1.3,
  },
  
  subtitle: {
    color: '#666',
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    marginBottom: '20px',
    lineHeight: 1.4,
  },
  
  divider: {
    color: '#ccc',
    margin: 'clamp(16px, 4vw, 24px) 0',
  },
  
  formInput: {
    borderRadius: 'clamp(8px, 2vw, 12px)',
    padding: 'clamp(10px, 3vw, 14px)',
    fontSize: 'clamp(14px, 4vw, 16px)',
    minHeight: '44px',
    border: '2px solid transparent', // Will be overridden in component
  },
  
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  
  formItemHalf: {
    width: '48%',
    minWidth: '180px',
    marginBottom: '12px',
    display: 'inline-block' as const,
    verticalAlign: 'top' as const,
  },
  
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  
  link: {
    color: 'inherit', // Will be overridden in component
    padding: 0,
    fontWeight: '600',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
  },
  
  centerText: {
    textAlign: 'center' as const,
  },
  
  backHome: {
    textAlign: 'center' as const,
    marginTop: 'clamp(16px, 4vw, 20px)',
  },
  
  errorMessage: {
    color: '#ff4d4f',
    backgroundColor: '#fff2f0',
    border: '1px solid #ffccc7',
    borderRadius: 'clamp(6px, 1.5vw, 8px)',
    padding: 'clamp(10px, 3vw, 12px)',
    marginBottom: '16px',
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  },
  
  successMessage: {
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    border: '1px solid #b7eb8f',
    borderRadius: 'clamp(6px, 1.5vw, 8px)',
    padding: 'clamp(10px, 3vw, 12px)',
    marginBottom: '16px',
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    lineHeight: 1.4,
  },
  
  checkbox: {
    color: '#666',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
  },
};

// Media query styles for mobile
export const mobileAuthStyles: Partial<AuthFormStyles> = {
  container: {
    padding: '5px',
    alignItems: 'flex-start' as const,
    justifyContent: 'flex-start' as const,
  },
  
  card: {
    maxWidth: '100%',
    padding: '16px',
  },
  
  formRow: {
    flexDirection: 'column' as const,
    gap: '0',
  },
  
  formItemHalf: {
    width: '100%',
    minWidth: 'unset' as const,
    marginBottom: '8px',
  },
  
  divider: {
    margin: '12px 0',
  },
};

export default authFormStyles;
