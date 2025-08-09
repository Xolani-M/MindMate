import React from 'react';
import { Alert } from 'antd';

interface SignupErrorProps {
  error?: string;
  onClose?: () => void;
}

export const SignupError: React.FC<SignupErrorProps> = ({ error, onClose }) => {
  if (!error) return null;

  const getErrorConfig = (errorMessage: string) => {
    if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
      return {
        type: 'warning' as const,
        title: 'Account Already Exists',
        description: 'An account with this email already exists. Please try logging in instead.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
      return {
        type: 'error' as const,
        title: 'Invalid Email Address',
        description: 'Please enter a valid email address format.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('password')) {
      return {
        type: 'error' as const,
        title: 'Password Requirements',
        description: 'Password must be at least 6 characters long with letters and numbers.',
        showIcon: false,
      };
    }
    
    if (errorMessage.includes('connection') || errorMessage.includes('network')) {
      return {
        type: 'error' as const,
        title: 'Connection Problem',
        description: 'Unable to create account. Please check your connection and try again.',
        showIcon: false,
      };
    }
    
    return {
      type: 'error' as const,
      title: 'Registration Failed',
      description: 'Please check your information and try again.',
      showIcon: false,
    };
  };

  const config = getErrorConfig(error);

  return (
    <div style={{ marginBottom: '16px' }}>
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

interface SignupSuccessProps {
  visible: boolean;
}

export const SignupSuccess: React.FC<SignupSuccessProps> = () => {
  return null; // No feedback box needed - using button text only
};
