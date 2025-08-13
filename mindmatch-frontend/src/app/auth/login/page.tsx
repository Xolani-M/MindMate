"use client";
import React, { useState } from 'react';
import { useAuthActions, useAuthState } from '@/providers/authProvider';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { GlassCard, GlowButton } from '@/components/MindMateComponents';
import { styles } from '@/components/styles';
import loginStyles from './loginstyles';
import { LoginError, LoginSuccess } from './LoginFeedback';
import { useRouter } from 'next/navigation';
import './login.module.css';
import './auth-animations.css';

const { Title, Text } = Typography;

const passwordIconRender = (visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

export default function LoginPage() {
  const { loginUser, resetAuthState } = useAuthActions();
  const { isPending, isError, isSuccess, errorMessage } = useAuthState();
  const [form] = Form.useForm();
  const [passwordValue, setPasswordValue] = useState('');
  const router = useRouter();

  // Clear any previous errors when component mounts
  React.useEffect(() => {
    resetAuthState();
  }, [resetAuthState]);

  // Handle successful login - redirect happens in auth provider
  React.useEffect(() => {
    if (isSuccess) {
      console.log('🎉 Login success detected in login page, auth provider will handle redirect');
      // Do NOT reset auth state here - it would clear the user data!
      // The auth provider already handles the redirect after setting user state
    }
  }, [isSuccess]);

  return (
    <div
      style={{
        ...loginStyles.container as React.CSSProperties,
        background: `linear-gradient(135deg, ${styles.colors.background}, #f0f4ff)`,
      }}
    >
      {/* Background Orbs */}
      <div
        style={{
          ...loginStyles.orbTop as React.CSSProperties,
          background: `radial-gradient(circle, ${styles.colors.healingGlow}, transparent)`,
        }}
      />
      <div
        style={{
          ...loginStyles.orbBottom as React.CSSProperties,
          background: `radial-gradient(circle, rgba(20, 184, 166, 0.15), transparent)`,
        }}
      />

  <GlassCard style={loginStyles.card as React.CSSProperties}>
          {/* Header with MindMate logo */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: styles.colors.primary,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center',
              marginBottom: '5px'
            }}>
              MindMate
            </div>
          </div>

          <div style={{ ...loginStyles.centerText as React.CSSProperties, marginBottom: '25px' }}>
            <Title level={2} style={{ ...loginStyles.title as React.CSSProperties, color: styles.colors.primary }}>
              Welcome Back
            </Title>
            <Text style={loginStyles.subtitle as React.CSSProperties}>
              Continue your wellness journey with personalized support.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={async (values) => {
              if (isPending) return; // Prevent multiple submissions
              
              try {
                await loginUser({
                  email: values.email?.trim(),
                  password: values.password,
                });
                // Navigation is handled in the auth provider after successful login
              } catch (error) {
                console.error('Login submission error:', error);
                // Error handling is managed by the auth provider
              }
            }}
            onFinishFailed={(errorInfo) => {
              console.log('Form validation failed:', errorInfo);
            }}
            disabled={isPending}
          >
            <Form.Item 
              name="email" 
              rules={[
                { required: true, message: 'Please enter your email address' }, 
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
              hasFeedback
              className="auth-form-item"
            > 
              <Input
                prefix={<MailOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Enter your email address"
                style={{
                  ...loginStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                  borderRadius: '12px',
                  padding: 'clamp(12px, 3vw, 16px)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                }}
                autoComplete="email"
                size="large"
                disabled={isPending}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${styles.colors.healingGlow}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.colors.healingGlow;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              hasFeedback
              className="auth-form-item"
            > 
              <Input.Password
                prefix={<LockOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Enter your password"
                iconRender={passwordIconRender}
                style={{
                  ...loginStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                  borderRadius: '12px',
                  padding: 'clamp(12px, 3vw, 16px)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                autoComplete="current-password"
                size="large"
                disabled={isPending}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${styles.colors.healingGlow}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.colors.healingGlow;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '16px' }}>
              <div style={loginStyles.rememberRow as React.CSSProperties}>
                <Checkbox style={{ color: '#666', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
                  Remember me
                </Checkbox>
                <Button 
                  type="link" 
                  style={{ 
                    ...loginStyles.link as React.CSSProperties, 
                    color: styles.colors.primary 
                  }}
                  disabled={isPending}
                >
                  Forgot password?
                </Button>
              </div>
            </Form.Item>
            <Form.Item>
              <GlowButton 
                htmlType="submit" 
                loading={isPending} 
                className={`auth-button ${isPending ? 'loading-button' : ''}`}
                style={{ 
                  width: '100%', 
                  marginBottom: '15px',
                  height: 'clamp(48px, 12vw, 56px)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  background: styles.colors.gradientHover, // Gradient as default
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.2)',
                  transition: 'none',
                  color: isPending ? '#1f2937' : '#ffffff',
                }}
                disabled={isPending}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isPending) {
                    e.currentTarget.style.background = styles.colors.primary; // Solid color on hover only when not loading
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isPending) {
                    e.currentTarget.style.background = styles.colors.gradientHover; // Back to gradient only when not loading
                  }
                }}
              >
                {isPending ? (
                  <span className="loading-text">Signing you in...</span>
                ) : (
                  <span style={{ color: '#ffffff' }}>Continue Your Journey</span>
                )}
              </GlowButton>
            </Form.Item>

            {/* Enhanced Error Display */}
            <LoginError error={isError ? errorMessage : undefined} />
            
            {/* Success/Loading Display */}
            <LoginSuccess visible={isPending} />
          </Form>

          <Divider style={loginStyles.divider as React.CSSProperties}>or</Divider>

          <div style={loginStyles.centerText as React.CSSProperties}>
            <Text style={{ color: '#666' }}>New to MindMate? </Text>
            <Button
              type="link"
              onClick={() => router.push('/auth/seeker-signup')}
              style={{ ...loginStyles.link as React.CSSProperties, color: styles.colors.primary }}
            >
              Begin your wellness journey
            </Button>
          </div>

          <div style={loginStyles.backHome as React.CSSProperties}>
            <Button
              type="link"
              onClick={() => router.push('/')}
              style={{ color: '#999', padding: 0 }}
            >
              ← Back to home
            </Button>
          </div>
  </GlassCard>
    </div>
  );
}
