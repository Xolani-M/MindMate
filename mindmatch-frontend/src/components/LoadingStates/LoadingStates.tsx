import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Icons from '@/components/Icons';
import styles from './LoadingStates.module.css';

interface LoadingStateProps {
  type?: 'dashboard' | 'data' | 'general';
  message?: string;
  className?: string;
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ModernLoadingState: React.FC<LoadingStateProps> = ({ 
  type = 'general', 
  message,
  className 
}) => {
  const config = {
    icon: <Icons.SparkleIcon size="large" />,
    title: type === 'dashboard' ? 'Loading Your Wellness Hub' : 'Analyzing Your Progress',
    message: message || 'Please wait while we prepare everything for you...'
  };

  return (
    <div className={`${styles.loadingContainer} ${className || ''}`}>
      {/* Background orbs */}
      <div className={styles.loadingOrb1} />
      <div className={styles.loadingOrb2} />
      <div className={styles.loadingOrb3} />
      
      {/* Main loading content */}
      <div className={styles.loadingContent}>
        <div className={styles.loadingIcon}>
          {config.icon}
        </div>
        
        <h1 className={styles.loadingTitle}>
          {config.title}
        </h1>
        
        <p className={styles.loadingMessage}>
          {config.message}
        </p>
        
        {/* Progress bar */}
        <div className={styles.loadingProgress}>
          <div className={styles.loadingBar} />
        </div>
        

      </div>
    </div>
  );
};

export const ModernErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  onRetry,
  className 
}) => {
  return (
    <div className={`${styles.errorContainer} ${className || ''}`}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          <AlertTriangle size={48} />
        </div>
        
        <h1 className={styles.errorTitle}>
          Something went wrong
        </h1>
        
        <p className={styles.errorMessage}>
          {message || 'We encountered an issue while loading your dashboard. Please try again.'}
        </p>
        
        {onRetry && (
          <button 
            className={styles.retryButton}
            onClick={onRetry}
            type="button"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ModernLoadingState;
