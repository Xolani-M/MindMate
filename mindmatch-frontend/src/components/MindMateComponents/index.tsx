import React, { ReactNode, CSSProperties } from 'react';
import { Button, Card, Progress, Typography } from 'antd';
import { styles } from '../styles';

const { Text } = Typography;

// Floating Animation Component
export const FloatingElement: React.FC<{ children: ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div
    style={{
      animation: `float 6s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      transform: 'translateY(0px)',
    }}
  >
    {children}
  </div>
);

// Gradient Text Component
export const GradientText: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style = {} }) => (
  <span
    style={{
      background: styles.colors.gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold',
      ...style,
    }}
  >
    {children}
  </span>
);

// Glowing Button Component
export const GlowButton: React.FC<{
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  type?: "primary" | "default" | "dashed" | "link" | "text" | undefined;
  size?: "large" | "middle" | "small";
  style?: CSSProperties;
  [key: string]: unknown;
}> = ({ children, loading, onClick, type = "primary", size = "large", ...props }) => (
  <Button
    type={type}
    size={size}
    loading={loading}
    onClick={onClick}
    {...props}
    style={{
      background: styles.colors.gradientHover, // Always use hover color
      border: 'none',
      borderRadius: '15px',
      height: '50px',
      fontSize: '16px',
      fontWeight: '600',
      boxShadow: styles.shadows.glow, // Always use glow shadow
      transition: 'none', // Remove all transitions - immediate response
      position: 'relative',
      overflow: 'hidden',
      ...props.style,
    }}
    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.target as HTMLButtonElement;
      btn.style.background = styles.colors.gradientHover; // Keep same color
      btn.style.boxShadow = styles.shadows.glow; // Keep same shadow
      btn.style.transform = 'translateY(-2px)'; // Only transform changes
    }}
    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.target as HTMLButtonElement;
      btn.style.background = styles.colors.gradientHover; // Keep same color
      btn.style.boxShadow = styles.shadows.glow; // Keep same shadow  
      btn.style.transform = 'translateY(0)'; // Reset transform
    }}
  >
    {children}
  </Button>
);

// Glass Card Component
export const GlassCard: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  hoverable?: boolean;
}> = ({ children, style = {}, hoverable = true }) => (
  <Card
    variant="outlined"
    style={{
      ...styles.glass,
      boxShadow: styles.shadows.medium,
      transition: styles.transitions.smooth,
      ...style,
    }}
    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverable) {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = styles.shadows.strong;
      }
    }}
    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverable) {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = styles.shadows.medium;
      }
    }}
  >
    {children}
  </Card>
);

// Strength Indicator
export const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/\d/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength < 50) return '#ff4d4f';
    if (strength < 75) return '#faad14';
    return '#52c41a';
  };

  if (!password) return null;

  let strengthLabel = 'Strong';
  if (strength < 50) strengthLabel = 'Weak';
  else if (strength < 75) strengthLabel = 'Good';

  return (
    <div style={{ marginTop: '8px' }}>
      <Progress
        percent={strength}
        strokeColor={getColor()}
        showInfo={false}
        strokeWidth={4}
        trailColor="rgba(255,255,255,0.2)"
      />
      <Text style={{ fontSize: '12px', color: getColor() }}>
        {strengthLabel} password
      </Text>
    </div>
  );
};
