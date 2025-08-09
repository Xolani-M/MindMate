import React, { ReactNode } from 'react';
import { Typography, Divider, Button, Input } from 'antd';
import { FloatingElement, GlassCard } from '../MindMateComponents';
import { styles } from '../styles';
import { authFormStyles } from './AuthFormStyles';

const { Title, Text } = Typography;

interface AuthFormProps {
  title: string;
  subtitle: string;
  emoji: string;
  children: ReactNode;
  bottomText?: string;
  bottomLinkText?: string;
  bottomLinkAction?: () => void;
  backToHomeAction?: () => void;
  className?: string;
}

export const AuthFormContainer: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  emoji,
  children,
  bottomText,
  bottomLinkText,
  bottomLinkAction,
  backToHomeAction,
  className = '',
}) => {
  return (
    <div
      className={`auth-container ${className}`}
      style={{
        ...authFormStyles.container,
        background: `linear-gradient(135deg, ${styles.colors.background}, #f0f4ff)`,
      }}
    >
      {/* Background Orbs */}
      <div
        style={{
          ...authFormStyles.orbTop,
          background: `radial-gradient(circle, ${styles.colors.healingGlow}, transparent)`,
        }}
      />
      <div
        style={{
          ...authFormStyles.orbBottom,
          background: `radial-gradient(circle, ${styles.colors.primary}40, transparent)`,
        }}
      />

      <FloatingElement>
        <GlassCard style={authFormStyles.card}>
          {/* Header */}
          <div style={authFormStyles.centerText}>
            <div style={authFormStyles.emoji}>{emoji}</div>
            <Title level={1} style={authFormStyles.title}>
              {title}
            </Title>
            <Text style={authFormStyles.subtitle}>
              {subtitle}
            </Text>
          </div>

          <Divider style={authFormStyles.divider}>
            <Text style={{ color: '#ccc', fontSize: '14px' }}>Enter your details</Text>
          </Divider>

          {/* Form Content */}
          {children}

          {/* Bottom Links */}
          {(bottomText || bottomLinkText) && (
            <>
              <Divider style={authFormStyles.divider}>or</Divider>
              <div style={authFormStyles.centerText}>
                <Text style={{ color: '#666' }}>{bottomText} </Text>
                {bottomLinkText && bottomLinkAction && (
                  <Button
                    type="link"
                    onClick={bottomLinkAction}
                    style={{ 
                      ...authFormStyles.link, 
                      color: styles.colors.primary 
                    }}
                  >
                    {bottomLinkText}
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Back to Home */}
          {backToHomeAction && (
            <div style={authFormStyles.backHome}>
              <Button
                type="link"
                onClick={backToHomeAction}
                style={{ color: '#999', padding: 0 }}
              >
                ← Back to home
              </Button>
            </div>
          )}
        </GlassCard>
      </FloatingElement>
    </div>
  );
};

interface AuthFormFieldProps {
  prefix?: ReactNode;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
  size?: 'large' | 'middle' | 'small';
  iconRender?: (visible: boolean) => ReactNode;
  style?: React.CSSProperties;
}

export const AuthFormField: React.FC<AuthFormFieldProps> = ({
  style,
  ...props
}) => {
  const inputStyle = {
    ...authFormStyles.formInput,
    border: `2px solid ${styles.colors.healingGlow}`,
    ...style,
  };

  if (props.type === 'password') {
    return (
      <Input.Password
        {...props}
        style={inputStyle}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
          e.target.style.borderColor = styles.colors.primary;
          e.target.style.boxShadow = `0 0 0 3px ${styles.colors.healingGlow}40`;
          props.onFocus?.(e);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          e.target.style.borderColor = styles.colors.healingGlow;
          e.target.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      />
    );
  }

  return (
    <Input
      {...props}
      style={inputStyle}
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = styles.colors.primary;
        e.target.style.boxShadow = `0 0 0 3px ${styles.colors.healingGlow}40`;
        props.onFocus?.(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = styles.colors.healingGlow;
        e.target.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
};

export default AuthFormContainer;
