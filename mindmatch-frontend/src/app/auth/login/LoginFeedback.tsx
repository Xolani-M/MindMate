import React from 'react';
import { Alert } from 'antd';

interface LoginErrorProps {
  error?: string;
  onClose?: () => void;
}

export const LoginError: React.FC<LoginErrorProps> = ({ error, onClose }) => {
  if (!error) return null;

  // Parse error types for better UX
  const getErrorConfig = (errorMessage: string) => {
    if (errorMessage.includes('Invalid email or password')) {
      return {
        type: 'error' as const,
        title: 'Invalid Credentials',
        description: 'Please check your email and password and try again.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('verify your email')) {
      return {
        type: 'warning' as const,
        title: 'Email Verification Required',
        description: 'Please verify your email address before logging in.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('not active')) {
      return {
        type: 'warning' as const,
        title: 'Account Inactive',
        description: 'Your account is not active. Please contact support.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('connection') || errorMessage.includes('network')) {
      return {
        type: 'error' as const,
        title: 'Connection Problem',
        description: 'Unable to connect to the server. Please check your internet connection.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('locked')) {
      return {
        type: 'warning' as const,
        title: 'Account Locked',
        description: 'Your account has been temporarily locked. Please try again later.',
        showIcon: false,
      };
    }
    
    // Default fallback - show only a clean message without redundancy
    return {
      type: 'error' as const,
      title: 'Login Failed',
      description: 'Please check your credentials and try again.',
      showIcon: false,
    };
  };

  const config = getErrorConfig(error);

  return (
    <div style={{ 
      marginBottom: '16px'
    }}>
      <Alert
        {...config}
        closable={!!onClose}
        onClose={onClose}
        style={{
          borderRadius: '12px',
          fontSize: '14px',
          lineHeight: '1.4',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
        message={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong>{config.title}</strong>
          </div>
        }
        description={config.description}
      />
    </div>
  );
};

interface LoginSuccessProps {
  visible: boolean;
}

export const LoginSuccess: React.FC<LoginSuccessProps> = () => {
  return null; // No feedback box needed - using button text only
};
