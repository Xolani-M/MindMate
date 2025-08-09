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
        icon: '🔐',
        title: 'Authentication Failed',
        description: errorMessage,
        showIcon: true,
      };
    }
    
    if (errorMessage.includes('verify your email')) {
      return {
        type: 'warning' as const,
        icon: '📧',
        title: 'Email Verification Required',
        description: errorMessage,
        showIcon: true,
      };
    }
    
    if (errorMessage.includes('connection') || errorMessage.includes('network')) {
      return {
        type: 'error' as const,
        icon: '🌐',
        title: 'Connection Problem',
        description: errorMessage,
        showIcon: true,
      };
    }
    
    if (errorMessage.includes('locked')) {
      return {
        type: 'warning' as const,
        icon: '🔒',
        title: 'Account Locked',
        description: errorMessage,
        showIcon: true,
      };
    }
    
    return {
      type: 'error' as const,
      icon: '⚠️',
      title: 'Login Failed',
      description: errorMessage,
      showIcon: true,
    };
  };

  const config = getErrorConfig(error);

  return (
    <Alert
      {...config}
      closable={!!onClose}
      onClose={onClose}
      style={{
        marginBottom: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.4',
      }}
      message={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{config.icon}</span>
          <strong>{config.title}</strong>
        </div>
      }
      description={config.description}
    />
  );
};

interface LoginSuccessProps {
  visible: boolean;
}

export const LoginSuccess: React.FC<LoginSuccessProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Alert
      type="success"
      showIcon
      message={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>✅</span>
          <strong>Welcome Back!</strong>
        </div>
      }
      description="Login successful! Taking you to your dashboard..."
      style={{
        marginBottom: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.4',
      }}
    />
  );
};
