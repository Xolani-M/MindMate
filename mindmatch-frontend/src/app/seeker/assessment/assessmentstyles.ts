/**
 * @fileoverview Assessment Page Styling Configuration
 * @description Comprehensive styling definitions for assessment interface components with improved accessibility
 * @author MINDMATE Development Team
 * @version 1.0.0
 */

//#region Type Definitions

/**
 * CSS Properties interface for TypeScript compatibility
 * Extends React.CSSProperties with media query support
 */
interface IAssessmentStyles {
  [key: string]: React.CSSProperties & {
    '@media (max-width: 768px)'?: React.CSSProperties;
    '@media (max-width: 480px)'?: React.CSSProperties;
    '@media (hover: hover)'?: {
      ':hover'?: React.CSSProperties;
    };
    '@media (focus)'?: React.CSSProperties;
  };
}

//#endregion Type Definitions

//#region Constants

/**
 * Assessment styling configuration object
 * Provides comprehensive styling for all assessment interface components
 */
const assessmentStyles: IAssessmentStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '100vw',
    padding: '16px',
    '@media (max-width: 768px)': {
      padding: '8px',
    },
  },
  orbTop: {
    position: 'absolute',
    top: '8%',
    right: '10%',
    width: '220px',
    height: '220px',
    background: 'radial-gradient(circle at 60% 40%, #818cf8 0%, #6366f1 100%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: 0.5,
    zIndex: 1,
    '@media (max-width: 768px)': {
      width: '120px',
      height: '120px',
      top: '5%',
      right: '5%',
    },
  },
  orbBottom: {
    position: 'absolute',
    bottom: '10%',
    left: '8%',
    width: '160px',
    height: '160px',
    background: 'radial-gradient(circle at 40% 60%, #a5b4fc 0%, #6366f1 100%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.7,
    zIndex: 1,
    '@media (max-width: 768px)': {
      width: '100px',
      height: '100px',
      bottom: '5%',
      left: '5%',
    },
  },
  card: {
    maxWidth: '600px',
    width: '100%',
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 4px 32px rgba(99,102,241,0.15)',
    padding: '32px',
    margin: '16px',
    border: '1px solid #e5e7eb',
    zIndex: 2,
    position: 'relative',
    '@media (max-width: 768px)': {
      padding: '20px',
      borderRadius: '16px',
      margin: '8px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
      borderRadius: '12px',
      margin: '4px',
    },
  },
  progressBarBg: {
    width: '100%',
    background: '#f3f4f6',
    borderRadius: '8px',
    height: '12px',
    marginBottom: '24px',
    '@media (max-width: 768px)': {
      height: '10px',
      marginBottom: '20px',
    },
  },
  progressBar: {
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    height: '100%',
    borderRadius: '8px',
    transition: 'width 0.4s ease-in-out',
    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
  },
  questionCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    padding: '28px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    '@media (max-width: 768px)': {
      padding: '20px',
      borderRadius: '12px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
      borderRadius: '10px',
    },
  },
  reviewCard: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    padding: '28px',
    border: '1px solid #e2e8f0',
    '@media (max-width: 768px)': {
      padding: '20px',
      borderRadius: '12px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
      borderRadius: '10px',
    },
  },
  buttonPrimary: {
    padding: '14px 32px',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
    transition: 'all 0.3s ease',
    minWidth: '120px',
    '@media (hover: hover)': {
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
      },
    },
    '@media (max-width: 768px)': {
      padding: '12px 24px',
      fontSize: '15px',
      minWidth: '100px',
    },
    '@media (max-width: 480px)': {
      padding: '10px 20px',
      fontSize: '14px',
      minWidth: '90px',
    },
  },
  buttonSecondary: {
    padding: '12px 28px',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#475569',
    fontWeight: 600,
    fontSize: '16px',
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '120px',
    '@media (hover: hover)': {
      ':hover': {
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        transform: 'translateY(-1px)',
      },
    },
    '@media (max-width: 768px)': {
      padding: '10px 20px',
      fontSize: '15px',
      minWidth: '100px',
    },
    '@media (max-width: 480px)': {
      padding: '8px 16px',
      fontSize: '14px',
      minWidth: '80px',
    },
  },
  buttonDisabled: {
    background: '#e5e7eb !important',
    color: '#9ca3af !important',
    cursor: 'not-allowed !important',
    boxShadow: 'none !important',
    transform: 'none !important',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontWeight: 400,
    cursor: 'pointer',
    padding: '12px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '@media (hover: hover)': {
      ':hover': {
        background: '#f8fafc',
      },
    },
    '@media (max-width: 480px)': {
      padding: '10px 12px',
      gap: '10px',
    },
  },
  selectInput: {
    padding: '14px 40px 14px 18px',
    borderRadius: '12px',
    border: '2px solid #cbd5e1',
    fontSize: '16px',
    fontWeight: '500',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    color: '#1e293b',
    transition: 'all 0.3s ease',
    minWidth: '280px',
    width: '100%',
    maxWidth: '400px',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 16px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media (focus)': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.1), 0 1px 3px rgba(0, 0, 0, 0.1)',
      outline: 'none',
    },
    '@media (hover: hover)': {
      ':hover': {
        borderColor: '#94a3b8',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      },
    },
    '@media (max-width: 768px)': {
      padding: '12px 36px 12px 16px',
      fontSize: '15px',
      minWidth: '240px',
      backgroundPosition: 'right 12px center',
      backgroundSize: '14px',
    },
    '@media (max-width: 480px)': {
      padding: '10px 32px 10px 14px',
      fontSize: '14px',
      minWidth: '200px',
      backgroundPosition: 'right 10px center',
      backgroundSize: '12px',
    },
  },
  textareaInput: {
    width: '100%',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    padding: '12px 16px',
    fontSize: '16px',
    background: '#fff',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    fontFamily: 'inherit',
    '@media (focus)': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
    },
    '@media (max-width: 768px)': {
      padding: '10px 14px',
      fontSize: '15px',
    },
    '@media (max-width: 480px)': {
      padding: '8px 12px',
      fontSize: '14px',
    },
  },
};

//#endregion Constants

/**
 * Default export of assessment styling configuration
 * Provides type-safe styling objects for assessment components
 */
export default assessmentStyles;
