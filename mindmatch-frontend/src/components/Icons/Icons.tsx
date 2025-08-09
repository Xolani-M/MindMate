import React from 'react';
import { 
  Heart, 
  TrendingUp, 
  Shield, 
  Brain, 
  Zap, 
  BookOpen, 
  MessageCircle, 
  Sparkles,
  Activity,
  Target,
  Award,
  Smile
} from 'lucide-react';
import styles from './Icons.module.css';

interface IconProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getIconSize = (size: 'small' | 'medium' | 'large'): number => {
  switch (size) {
    case 'small': return 16;
    case 'large': return 32;
    default: return 24;
  }
};

export const WellnessIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.wellnessIcon} ${styles[size]} ${className || ''}`}>
      <Heart size={iconSize} />
    </div>
  );
};

export const AnalyticsIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.analyticsIcon} ${styles[size]} ${className || ''}`}>
      <TrendingUp size={iconSize} />
    </div>
  );
};

export const SecurityIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.securityIcon} ${styles[size]} ${className || ''}`}>
      <Shield size={iconSize} />
    </div>
  );
};

export const BrainIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.brainIcon} ${styles[size]} ${className || ''}`}>
      <Brain size={iconSize} />
    </div>
  );
};

export const MindfulnessIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.mindfulnessIcon} ${styles[size]} ${className || ''}`}>
      <Zap size={iconSize} />
    </div>
  );
};

export const JournalIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.journalIcon} ${styles[size]} ${className || ''}`}>
      <BookOpen size={iconSize} />
    </div>
  );
};

export const ChatIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.chatIcon} ${styles[size]} ${className || ''}`}>
      <MessageCircle size={iconSize} />
    </div>
  );
};

export const SparkleIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.sparkleIcon} ${styles[size]} ${className || ''}`}>
      <Sparkles size={iconSize} />
    </div>
  );
};

// Additional modern icons for variety
export const ActivityIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.analyticsIcon} ${styles[size]} ${className || ''}`}>
      <Activity size={iconSize} />
    </div>
  );
};

export const TargetIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.securityIcon} ${styles[size]} ${className || ''}`}>
      <Target size={iconSize} />
    </div>
  );
};

export const AwardIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.sparkleIcon} ${styles[size]} ${className || ''}`}>
      <Award size={iconSize} />
    </div>
  );
};

export const SmileIcon: React.FC<IconProps> = ({ size = 'medium', className }) => {
  const iconSize = getIconSize(size);
  return (
    <div className={`${styles.iconContainer} ${styles.wellnessIcon} ${styles[size]} ${className || ''}`}>
      <Smile size={iconSize} />
    </div>
  );
};

// Export as default object for easy access
const Icons = {
  WellnessIcon,
  AnalyticsIcon,
  SecurityIcon,
  BrainIcon,
  MindfulnessIcon,
  JournalIcon,
  ChatIcon,
  SparkleIcon,
  ActivityIcon,
  TargetIcon,
  AwardIcon,
  SmileIcon,
};

export default Icons;
