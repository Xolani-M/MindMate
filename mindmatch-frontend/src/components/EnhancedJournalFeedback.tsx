/**
 * @fileoverview Enhanced Journal Feedback Component
 * @description Provides clear, persistent feedback for journal entry operations
 * @author MindMate Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';

//#region Type Definitions

/**
 * Feedback state enumeration
 * Defines the possible states of journal entry feedback
 */
enum FeedbackState {
  /** No feedback currently shown */
  NONE = 'none',
  /** Entry submission in progress */
  LOADING = 'loading',
  /** Entry submission successful */
  SUCCESS = 'success',
  /** Entry submission failed */
  ERROR = 'error'
}

/**
 * Props for the Enhanced Journal Feedback component
 */
interface IEnhancedJournalFeedbackProps {
  /** Current feedback state */
  state: FeedbackState;
  /** Error message if in error state */
  errorMessage?: string;
  /** Callback when feedback is dismissed */
  onDismiss: () => void;
  /** Whether feedback can be manually dismissed */
  dismissible?: boolean;
}

//#endregion Type Definitions

/**
 * Enhanced Journal Feedback Component
 * 
 * Provides clear, persistent feedback for journal operations with:
 * - Distinct visual states for loading, success, and error
 * - Manual dismiss capability
 * - Clear messaging and iconography
 * - Smooth animations and transitions
 * - Auto-dismiss for success states
 * 
 * @param props - Component properties
 * @returns Rendered feedback component
 */
export const EnhancedJournalFeedback: React.FC<IEnhancedJournalFeedbackProps> = ({
  state,
  errorMessage,
  onDismiss,
  dismissible = true
}) => {

  //#region State Variables

  /**
   * Whether the feedback is currently visible
   */
  const [isVisible, setIsVisible] = useState<boolean>(false);

  /**
   * Auto-dismiss timer reference
   */
  const [dismissTimer, setDismissTimer] = useState<NodeJS.Timeout | null>(null);

  //#endregion State Variables

  //#region Event Handlers

  /**
   * Handles feedback dismissal
   */
  const handleDismiss = useCallback((): void => {
    setIsVisible(false);
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      setDismissTimer(null);
    }
    // Delay callback to allow animation to complete
    setTimeout(() => {
      onDismiss();
    }, 300);
  }, [onDismiss, dismissTimer]);

  //#endregion Event Handlers

  //#region Effects

  /**
   * Handle feedback state changes and visibility
   */
  useEffect(() => {
    if (state === FeedbackState.NONE) {
      setIsVisible(false);
      if (dismissTimer) {
        clearTimeout(dismissTimer);
        setDismissTimer(null);
      }
      return;
    }

    setIsVisible(true);

    // Auto-dismiss success messages after 4 seconds
    if (state === FeedbackState.SUCCESS) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 4000);
      setDismissTimer(timer);
    }

    // Clear any existing timer when state changes
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [state, dismissTimer, handleDismiss]);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [dismissTimer]);

  //#endregion Effects

  //#region Utility Methods

  /**
   * Gets the appropriate styling for the current feedback state
   * 
   * @returns Style configuration object
   */
  const getFeedbackStyles = useCallback(() => {
    const baseStyles = {
      position: 'fixed' as const,
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      minWidth: '320px',
      maxWidth: '500px',
      padding: '16px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0,
      translateY: isVisible ? '0px' : '-20px',
      fontSize: '15px',
      fontWeight: '500',
      border: '1px solid',
    };

    switch (state) {
      case FeedbackState.LOADING:
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
          color: '#3730a3',
          borderColor: '#a5b4fc',
        };
      case FeedbackState.SUCCESS:
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          color: '#065f46',
          borderColor: '#6ee7b7',
        };
      case FeedbackState.ERROR:
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          color: '#991b1b',
          borderColor: '#f87171',
        };
      default:
        return baseStyles;
    }
  }, [state, isVisible]);

  /**
   * Gets the appropriate icon for the current feedback state
   * 
   * @returns Icon element
   */
  const getFeedbackIcon = useCallback(() => {
    const iconStyles = {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      fontSize: '12px',
      fontWeight: '600',
    };

    switch (state) {
      case FeedbackState.LOADING:
        return (
          <div style={{ ...iconStyles, background: '#6366f1', color: 'white' }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        );
      case FeedbackState.SUCCESS:
        return (
          <div style={{ ...iconStyles, background: '#16a34a', color: 'white' }}>
            ✓
          </div>
        );
      case FeedbackState.ERROR:
        return (
          <div style={{ ...iconStyles, background: '#dc2626', color: 'white' }}>
            !
          </div>
        );
      default:
        return null;
    }
  }, [state]);

  /**
   * Gets the appropriate message for the current feedback state
   * 
   * @returns Feedback message string
   */
  const getFeedbackMessage = useCallback((): string => {
    switch (state) {
      case FeedbackState.LOADING:
        return 'Saving your journal entry...';
      case FeedbackState.SUCCESS:
        return 'Journal entry saved successfully! Keep nurturing your mental wellness.';
      case FeedbackState.ERROR:
        return errorMessage || 'Failed to save journal entry. Please check your connection and try again.';
      default:
        return '';
    }
  }, [state, errorMessage]);

  //#endregion Utility Methods

  // Don't render if state is NONE
  if (state === FeedbackState.NONE) {
    return null;
  }

  return (
    <>
      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={getFeedbackStyles()}>
        {getFeedbackIcon()}
        <div style={{ flex: 1 }}>
          {getFeedbackMessage()}
        </div>
        {dismissible && state !== FeedbackState.LOADING && (
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              transition: 'opacity 0.2s',
              fontSize: '16px',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            aria-label="Dismiss feedback"
          >
            ×
          </button>
        )}
      </div>
    </>
  );
};

export { FeedbackState };
export default EnhancedJournalFeedback;
