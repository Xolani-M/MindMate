/**
 * @fileoverview Dashboard styles for the mental health platform
 * Provides warm, welcoming, and therapeutic visual design
 * Follows MINDMATE coding standards with proper documentation
 * 
 * Design Philosophy:
 * - Warm, comforting colors that feel like home
 * - Gentle gradients and soft shadows for a calming effect
 * - Generous spacing and modern aesthetics
 * - Therapeutic color palette with nature-inspired accents
 */

const dashboardStyles = {
  // #region Loading States
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    fontSize: 20,
    color: '#10b981', // Emerald for growth and healing
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)',
  },
  loadingIcon: {
    marginRight: 12,
  },
  // #endregion

  // #region Error States
  error: {
    color: '#dc2626',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
    border: '1px solid #fecaca',
    borderRadius: 16,
    padding: 32,
    margin: 32,
    textAlign: 'center' as const,
    fontSize: 18,
    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.08)',
  },
  errorIcon: {
    marginRight: 8,
  },
  // #endregion

  // #region Layout Structure
  main: {
    maxWidth: 1400,
    width: '100%',
    zIndex: 2,
    position: 'relative' as const,
  },
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fefefe 0%, #f8fafc 25%, #ecfdf5 50%, #f0f9ff 75%, #fef7f7 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
    width: '100vw',
    padding: '0 0 200px 0', // Extra bottom padding for chat modal
  },
  // #endregion

  // #region Typography
  heading: {
    fontSize: '3rem',
    fontWeight: 800,
    marginBottom: 16,
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #6366f1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  subheading: {
    margin: '32px 0 24px 0',
    textAlign: 'center' as const,
    fontSize: 20,
    color: '#475569',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  // #endregion

  // #region Data Grid
  grid: {
    margin: '32px 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  },
  gridItem: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: 20,
    padding: 24,
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  // #endregion

  // #region Visual Elements
  emoji: {
    fontSize: 28,
  },
  value: {
    fontSize: 22,
    fontWeight: 600,
  },
  card: {
    maxWidth: '1200px',
    width: '100%',
    background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
    borderRadius: '32px',
    boxShadow: '0 20px 64px rgba(99, 102, 241, 0.12)',
    padding: '64px',
    margin: '64px auto',
    border: '1px solid #e2e8f0',
    zIndex: 2,
    position: 'relative' as const,
    backdropFilter: 'blur(20px)',
  },
  // #endregion

  // #region Decorative Elements
  orbTop: {
    position: 'absolute' as const,
    top: '5%',
    right: '8%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle at 50% 50%, #10b981 0%, #059669 50%, #047857 100%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.3,
    zIndex: 1,
    animation: 'float 6s ease-in-out infinite',
  },
  orbMiddle: {
    position: 'absolute' as const,
    top: '40%',
    left: '5%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle at 50% 50%, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: 0.25,
    zIndex: 1,
    animation: 'float 8s ease-in-out infinite reverse',
  },
  orbBottom: {
    position: 'absolute' as const,
    bottom: '8%',
    right: '15%',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle at 50% 50%, #f59e0b 0%, #f97316 50%, #ea580c 100%)',
    borderRadius: '50%',
    filter: 'blur(70px)',
    opacity: 0.2,
    zIndex: 1,
    animation: 'float 7s ease-in-out infinite',
  },
  // #endregion

  // #region Interactive Elements
  actionButton: {
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
  },
  // #endregion
};

// Add keyframe animations for floating orbs and sleek icon effects
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(3deg); }
      50% { transform: translateY(-10px) rotate(-2deg); }
      75% { transform: translateY(-15px) rotate(1deg); }
    }
    
    /* Sleek icon hover effects */
    .icon-hover {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    .icon-hover:hover {
      transform: translateY(-3px) scale(1.1);
      filter: drop-shadow(0 8px 16px rgba(16, 185, 129, 0.25));
    }
    
    /* Individual icon animations */
    .icon-hover:hover circle {
      transform-origin: center;
      animation: iconPulse 0.6s ease-out;
    }
    
    .icon-hover:hover path {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: iconDraw 0.8s ease-out forwards;
    }
    
    @keyframes iconPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes iconDraw {
      to { stroke-dashoffset: 0; }
    }
    
    /* Gradient shimmer effect on hover */
    .icon-hover:hover linearGradient stop {
      animation: shimmer 1.5s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0%, 100% { stop-opacity: 1; }
      50% { stop-opacity: 0.7; }
    }
    
    /* Hover effects for grid items */
    .dashboard-grid-item:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 16px 48px rgba(99, 102, 241, 0.15) !important;
    }
    
    /* Button hover effects */
    .dashboard-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
    }
    
    /* Chat button pulse animation */
    @keyframes pulse {
      0% { box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3); }
      50% { box-shadow: 0 16px 40px rgba(16, 185, 129, 0.5); }
      100% { box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3); }
    }
    
    /* Smooth scrolling for better UX */
    html {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(style);
}

export default dashboardStyles;
