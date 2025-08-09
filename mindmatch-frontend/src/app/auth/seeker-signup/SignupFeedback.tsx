import React, { useEffect, useState } from 'react';
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
        icon: '👤',
        title: 'Account Already Exists',
        description: 'An account with this email already exists. Try logging in instead.',
        showIcon: true,
      };
    }
    
    if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
      return {
        type: 'error' as const,
        icon: '📧',
        title: 'Invalid Email',
        description: errorMessage,
        showIcon: true,
      };
    }
    
    if (errorMessage.includes('password')) {
      return {
        type: 'error' as const,
        icon: '🔒',
        title: 'Password Issue',
        description: errorMessage,
        showIcon: true,
      };
    }
    
    if (errorMessage.includes('connection') || errorMessage.includes('network')) {
      return {
        type: 'error' as const,
        icon: '🌐',
        title: 'Connection Problem',
        description: 'Unable to create account. Please check your connection and try again.',
        showIcon: true,
      };
    }
    
    return {
      type: 'error' as const,
      icon: '⚠️',
      title: 'Registration Failed',
      description: errorMessage,
      showIcon: true,
    };
  };

  const config = getErrorConfig(error);

  return (
    <div className="slide-in" style={{ marginBottom: '16px' }}>
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
            <span style={{ fontSize: '16px' }}>{config.icon}</span>
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

export const SignupSuccess: React.FC<SignupSuccessProps> = ({ visible }) => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 8;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 150);

    return () => {
      clearInterval(dotInterval);
      clearInterval(progressInterval);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="success-slide-in" style={{ marginBottom: '16px' }}>
      <Alert
        type="success"
        showIcon
        message={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="loading-pulse" style={{ fontSize: '16px' }}>🎉</span>
            <strong>Welcome to MindMate!</strong>
          </div>
        }
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>
              Account created successfully! Redirecting to login{dots}
            </div>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(52, 211, 153, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div className="loading-shimmer" style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#34d399',
                borderRadius: '2px',
                transition: 'width 0.15s ease-out'
              }} />
            </div>
          </div>
        }
        style={{
          borderRadius: '12px',
          fontSize: '14px',
          lineHeight: '1.4',
          border: 'none',
          boxShadow: '0 4px 12px rgba(52, 211, 153, 0.2)',
        }}
      />
    </div>
  );
};
