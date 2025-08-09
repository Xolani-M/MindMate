/**
 * @fileoverview Enhanced Chat Error Display Component
 * @description Provides user-friendly error messages with actionable suggestions
 * @author MindMate Development Team
 * @version 1.0.0
 */

import React from 'react';

//#region Type Definitions

/**
 * Props for the Enhanced Chat Error Display component
 */
interface IEnhancedChatErrorProps {
  /** The error message to display */
  error: string;
  /** Callback to retry the last action */
  onRetry?: () => void;
  /** Callback to clear the error */
  onClear?: () => void;
}

//#endregion Type Definitions

/**
 * Enhanced Chat Error Display Component
 * 
 * Provides clear, actionable error messages for chat functionality with:
 * - User-friendly error explanations
 * - Retry and clear actions
 * - Professional styling
 * - Helpful troubleshooting suggestions
 * 
 * @param props - Component properties
 * @returns Rendered error display component
 */
export const EnhancedChatError: React.FC<IEnhancedChatErrorProps> = ({
  error,
  onRetry,
  onClear
}) => {

  //#region Utility Methods

  /**
   * Gets appropriate visual indicator based on error type
   * 
   * @returns Visual indicator element
   */
  const getErrorIndicator = (): React.ReactElement => {
    const baseStyle = {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    if (error.includes('session') || error.includes('log in')) {
      return <div style={{ ...baseStyle, background: 'linear-gradient(45deg, #dc2626, #b91c1c)' }} />;
    }
    if (error.includes('connection') || error.includes('network')) {
      return <div style={{ ...baseStyle, background: 'linear-gradient(45deg, #f59e0b, #d97706)' }} />;
    }
    if (error.includes('technical difficulties') || error.includes('internal')) {
      return <div style={{ ...baseStyle, background: 'linear-gradient(45deg, #7c3aed, #5b21b6)' }} />;
    }
    if (error.includes('permission')) {
      return <div style={{ ...baseStyle, background: 'linear-gradient(45deg, #dc2626, #b91c1c)' }} />;
    }
    return <div style={{ ...baseStyle, background: 'linear-gradient(45deg, #ef4444, #dc2626)' }} />;
  };

  /**
   * Gets appropriate suggestions based on error type
   * 
   * @returns Array of suggestion strings
   */
  const getSuggestions = (): string[] => {
    if (error.includes('session') || error.includes('log in')) {
      return ['Please log out and log back in', 'Clear your browser cache if the issue persists'];
    }
    if (error.includes('connection') || error.includes('network')) {
      return ['Check your internet connection', 'Try refreshing the page'];
    }
    if (error.includes('technical difficulties') || error.includes('internal')) {
      return ['Our team has been notified', 'Please try again in a few minutes', 'The issue should resolve automatically'];
    }
    if (error.includes('permission')) {
      return ['Contact support for assistance', 'Ensure you have the correct access level'];
    }
    return ['Try sending your message again', 'Refresh the page if the problem continues'];
  };

  //#endregion Utility Methods

  const suggestions = getSuggestions();

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        padding: '16px 20px',
        margin: '12px 0',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
        maxWidth: '85%'
      }}
    >
      {/* Error Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ marginRight: '8px' }}>{getErrorIndicator()}</div>
        <span style={{ 
          fontWeight: '600', 
          color: '#991b1b',
          fontSize: '15px'
        }}>
          Chat Error
        </span>
      </div>

      {/* Error Message */}
      <div style={{
        color: '#7f1d1d',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '12px'
      }}>
        {error}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#991b1b',
            marginBottom: '6px'
          }}>
            Suggestions:
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '16px',
            fontSize: '13px',
            color: '#7f1d1d'
          }}>
            {suggestions.map((suggestion) => (
              <li key={suggestion} style={{ marginBottom: '4px' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            Try Again
          </button>
        )}
        {onClear && (
          <button
            onClick={onClear}
            style={{
              background: 'transparent',
              color: '#991b1b',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedChatError;
