const loginStyles = {
  container: {
    minHeight: '100vh',
    background: undefined, // set in component for dynamic gradient
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 'clamp(12px, 4vw, 20px)', // Responsive padding
  },
  orbTop: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: 'clamp(150px, 25vw, 300px)', // Responsive size
    height: 'clamp(150px, 25vw, 300px)',
    background: undefined, // set in component
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: 0.6,
  },
  orbBottom: {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: 'clamp(100px, 20vw, 200px)', // Responsive size
    height: 'clamp(100px, 20vw, 200px)',
    background: undefined, // set in component
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.8,
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    padding: 'clamp(16px, 5vw, 32px)', // Responsive padding
    margin: '0 auto',
    boxSizing: 'border-box',
    minHeight: 'unset',
    borderRadius: 'clamp(12px, 2vw, 20px)', // Responsive border radius
  },
  emoji: {
    fontSize: 'clamp(30px, 8vw, 50px)', // Responsive emoji size
    marginBottom: '15px',
  },
  title: {
    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', // Responsive title
    margin: 0,
    marginBottom: '10px',
    lineHeight: 1.3,
  },
  subtitle: {
    color: '#666',
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', // Responsive subtitle
    marginBottom: '20px',
    lineHeight: 1.4,
  },
  divider: {
    color: '#ccc',
    margin: 'clamp(16px, 4vw, 24px) 0',
  },
  formInput: {
    borderRadius: 'clamp(8px, 2vw, 12px)', // Responsive border radius
    border: undefined, // set in component
    padding: 'clamp(10px, 3vw, 14px)', // Responsive padding
    fontSize: 'clamp(14px, 4vw, 16px)', // Responsive font size
    minHeight: '44px', // Touch-friendly minimum height
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  link: {
    color: undefined, // set in component
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
};

export default loginStyles;
